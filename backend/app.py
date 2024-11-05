from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import Column, Integer, String, Float, Date  # Importando tipos corretos do SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:793415Ng_@localhost:3306/sistema_de_tarefas'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo de Tarefa
class Task(db.Model):
    __tablename__ = 'task'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    custo = db.Column(db.Float, nullable=False) 
    data_limite = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'custo': self.custo,
            'data_limite': self.data_limite.strftime('%Y-%m-%d') if self.data_limite else None
        }

# Rota para a raiz
@app.route('/')
def index():
    return render_template('index.html')

# Rota para obter tarefas
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

# Rota para adicionar uma nova tarefa
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    data_limite = datetime.strptime(data['data_limite'], '%Y-%m-%d')
    new_task = Task(nome=data['nome'], custo=data['custo'], data_limite=data_limite)
    try:
        db.session.add(new_task)
        db.session.commit()
        return jsonify(new_task.to_dict()), 201
    except Exception as e:
        db.session.rollback()  # Reverte a sessão em caso de erro
        return jsonify({'error': str(e)}), 500

# Rota para deletar uma tarefa
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'}), 204

# Criar as tabelas no banco de dados
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
