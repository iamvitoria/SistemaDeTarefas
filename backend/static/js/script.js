document.addEventListener('DOMContentLoaded', function() {
  let selectedTaskId = null; // Variável para armazenar a tarefa selecionada

  // Função para buscar as tarefas do servidor
  function fetchTasks() {
      fetch('/tasks')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              const taskList = document.getElementById('taskList');
              taskList.innerHTML = ''; // Limpa a lista antes de adicionar novas tarefas
              data.forEach(task => {
                  const listItem = document.createElement('li');
                  listItem.textContent = `Nome: ${task.nome}, Custo: ${task.custo}, Data Limite: ${task.data_limite}`;

                  // Adiciona um evento de clique para selecionar a tarefa
                  listItem.addEventListener('click', () => {
                      selectTask(task.id, listItem);
                  });

                  taskList.appendChild(listItem);
              });
          })
          .catch(error => {
              console.error('Erro ao buscar tarefas:', error);
              const taskList = document.getElementById('taskList');
              taskList.innerHTML = '<li>Erro ao carregar tarefas.</li>';
          });
  }

  // Função para selecionar uma tarefa
  function selectTask(taskId, listItem) {
      const taskItems = document.querySelectorAll('#taskList li');
      taskItems.forEach(item => item.classList.remove('selected')); // Remove a seleção de todas as tarefas
      listItem.classList.add('selected'); // Adiciona a classe de seleção ao item clicado
      selectedTaskId = taskId; // Atualiza a tarefa selecionada
  }

  // Envio do formulário para adicionar nova tarefa
  const saveTaskButton = document.getElementById('saveTaskButton');
  saveTaskButton.addEventListener('click', async () => {
      const nome = document.getElementById('nome').value;
      const custo = parseFloat(document.getElementById('custo').value);
      const data_limite = document.getElementById('data_limite').value;

      try {
          const response = await fetch('/tasks', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  nome,
                  custo,
                  data_limite
              }),
          });

          if (response.ok) {
              alert('Tarefa adicionada com sucesso!');
              fetchTasks(); // Atualiza a lista de tarefas
          } else {
              alert('Erro ao adicionar a tarefa.');
          }
      } catch (error) {
          console.error('Erro ao adicionar tarefa:', error);
      }
  });

  // Função para excluir a tarefa selecionada
  const deleteTaskButton = document.getElementById('deleteTaskButton');
  deleteTaskButton.addEventListener('click', () => {
      if (selectedTaskId) {
          if (confirm('Você tem certeza que deseja excluir esta tarefa?')) {
              fetch(`/tasks/${selectedTaskId}`, {
                  method: 'DELETE'
              })
              .then(response => {
                  if (response.ok) {
                      console.log('Task deleted');
                      fetchTasks(); // Atualiza a lista de tarefas após a exclusão
                      selectedTaskId = null; // Reseta a seleção
                  } else {
                      console.error('Erro ao deletar a tarefa');
                  }
              })
              .catch(error => console.error('Erro:', error));
          }
      } else {
          alert('Nenhuma tarefa selecionada para exclusão.');
      }
  });

  // Chama a função para buscar as tarefas ao carregar a página
  fetchTasks();
});
