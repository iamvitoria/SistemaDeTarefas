from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:793415Ng_@localhost:3306/sistema_de_tarefas'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo de Tarefa
class Task(db.Model):
    __tablename__ = 'tarefa'

    id = db.Column('idTarefa', db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    custo = db.Column(db.Float, nullable=False)
    data_limite = db.Column('dataLimite', db.Date, nullable=False)
    ordem = db.Column(db.Integer, unique=True, nullable=False)  # Coluna de ordem única

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'custo': self.custo,
            'data_limite': self.data_limite.strftime('%Y-%m-%d') if self.data_limite else None,
            'ordem': self.ordem
        }

# Rota para a raiz
@app.route('/')
def index():
    return render_template('index.html')

# Rota para obter todas as tarefas
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.order_by(Task.ordem).all()  # Ordena por 'ordem'
    return jsonify([task.to_dict() for task in tasks])

# Rota para obter uma tarefa específica pelo ID
@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict())

# Rota para adicionar uma nova tarefa
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    try:
        data_limite = datetime.strptime(data['data_limite'], '%Y-%m-%d')
        max_ordem = db.session.query(func.max(Task.ordem)).scalar()
        nova_ordem = (max_ordem or 0) + 1  # Incrementa a ordem
        new_task = Task(nome=data['nome'], custo=data['custo'], data_limite=data_limite, ordem=nova_ordem)
        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.to_dict()), 201
    except Exception as e:
        db.session.rollback()  # Reverte a sessão em caso de erro
        print(f"Erro ao adicionar tarefa: {e}")
        return jsonify({'error': str(e)}), 500

# Rota para editar uma tarefa
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def edit_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json
    if Task.query.filter(Task.nome == data['nome'], Task.id != task_id).first():
        return jsonify({'message': 'Esse nome de tarefa já existe. A edição não pode ser realizada.'}), 400

    try:
        task.nome = data['nome']
        task.custo = data['custo']
        task.data_limite = datetime.strptime(data['data_limite'], '%Y-%m-%d')
        db.session.commit()
        return jsonify(task.to_dict())
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao editar tarefa: {e}")
        return jsonify({'error': str(e)}), 500

# Rota para deletar uma tarefa
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'}), 204

# Rota para reordenar uma tarefa
@app.route('/tasks/reorder/<int:task_id>/<direction>', methods=['POST'])
def reorder_task(task_id, direction):
    task = Task.query.get_or_404(task_id)
    if direction == 'up':
        swap_task = Task.query.filter(Task.ordem < task.ordem).order_by(Task.ordem.desc()).first()
    elif direction == 'down':
        swap_task = Task.query.filter(Task.ordem > task.ordem).order_by(Task.ordem.asc()).first()
    else:
        return jsonify({'error': 'Invalid direction'}), 400

    if swap_task:
        # Troca as ordens
        task.ordem, swap_task.ordem = swap_task.ordem, task.ordem
        db.session.commit()
        return jsonify({'message': 'Reordered successfully'}), 200
    else:
        return jsonify({'error': 'Cannot reorder in this direction'}), 400

# Criar as tabelas no banco de dados
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
