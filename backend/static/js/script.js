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
                const row = document.createElement('tr'); // Cria uma nova linha para a tabela
                row.innerHTML = `
                    <td>${task.nome}</td>
                    <td>${task.custo}</td>
                    <td>${task.data_limite}</td>
                `;

                // Adiciona um evento de clique para selecionar a tarefa
                row.addEventListener('click', () => {
                    selectTask(task.id, row);
                });

                taskList.appendChild(row); // Adiciona a linha à tabela
            });
        })
        .catch(error => {
            console.error('Erro ao buscar tarefas:', error);
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '<tr><td colspan="3">Erro ao carregar tarefas.</td></tr>';
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

  // Função para abrir o popup de edição
  const editTaskButton = document.getElementById('editTaskButton');
  editTaskButton.addEventListener('click', () => {
      if (selectedTaskId) {
          openEditPopup(selectedTaskId);
      } else {
          alert('Nenhuma tarefa selecionada para edição.');
      }
  });

  // Função para abrir o popup e preencher os campos com os dados da tarefa selecionada
  function openEditPopup(taskId) {
      fetch(`/tasks/${taskId}`)
          .then(response => response.json())
          .then(task => {
              document.getElementById('editNome').value = task.nome;
              document.getElementById('editCusto').value = task.custo;
              document.getElementById('editDataLimite').value = task.data_limite;
              document.getElementById('editPopup').style.display = 'flex'; // Abre o popup
          })
          .catch(error => console.error('Erro ao buscar tarefa para edição:', error));
  }

  // Função para atualizar a tarefa
  const updateTaskButton = document.getElementById('updateTaskButton');
  updateTaskButton.addEventListener('click', async () => {
      const nome = document.getElementById('editNome').value;
      const custo = parseFloat(document.getElementById('editCusto').value);
      const data_limite = document.getElementById('editDataLimite').value;

      try {
          const response = await fetch(`/tasks/${selectedTaskId}`, {
              method: 'PUT',
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
              alert('Tarefa atualizada com sucesso!');
              fetchTasks(); // Atualiza a lista de tarefas
              closeEditPopup(); // Fecha o popup
          } else {
              alert('Erro ao atualizar a tarefa. Verifique se o nome já existe.');
          }
      } catch (error) {
          console.error('Erro ao atualizar tarefa:', error);
      }
  });

  // Função para fechar o popup
  const closePopupButton = document.getElementById('closePopupButton');
  closePopupButton.addEventListener('click', closeEditPopup);

  function closeEditPopup() {
      document.getElementById('editPopup').style.display = 'none'; // Fecha o popup
  }

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
