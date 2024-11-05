from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:793415Ng_@localhost:3306/sistema_de_tarefas'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo de Tarefa
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description
        }

# Rota para a raiz
@app.route('/')
def index():
    return "Bem-vindo ao Sistema de Tarefas!"

# Rota para obter tarefas
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

# Rota para adicionar uma nova tarefa
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    new_task = Task(title=data['title'], description=data.get('description'))
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

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
