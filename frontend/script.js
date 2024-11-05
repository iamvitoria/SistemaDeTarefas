// Função para carregar e exibir as tarefas da API
function loadTasks() {
    fetch('http://127.0.0.1:5000/tasks')
      .then(response => response.json())
      .then(tasks => {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = ''; // Limpa a lista para evitar duplicação
  
        tasks.forEach(task => {
          const listItem = document.createElement('li');
          listItem.textContent = task.title;
  
          // Botão para deletar a tarefa
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.onclick = () => deleteTask(task.id);
  
          listItem.appendChild(deleteButton);
          taskList.appendChild(listItem);
        });
      })
      .catch(error => console.error('Erro ao carregar as tarefas:', error));
  }
  
  // Função para adicionar uma nova tarefa via API
  function addTask() {
    const taskTitle = document.getElementById('newTask').value;
    if (!taskTitle) {
      alert('Por favor, insira o título da tarefa');
      return;
    }
  
    fetch('http://127.0.0.1:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: taskTitle })
    })
      .then(response => response.json())
      .then(task => {
        document.getElementById('newTask').value = ''; // Limpa o campo de entrada
        loadTasks(); // Recarrega a lista de tarefas
      })
      .catch(error => console.error('Erro ao adicionar a tarefa:', error));
  }
  
  // Função para deletar uma tarefa via API
  function deleteTask(taskId) {
    fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
      method: 'DELETE'
    })
      .then(() => loadTasks()) // Recarrega a lista de tarefas após a exclusão
      .catch(error => console.error('Erro ao deletar a tarefa:', error));
  }
  
  // Carrega as tarefas ao carregar a página
  document.addEventListener('DOMContentLoaded', loadTasks);
  