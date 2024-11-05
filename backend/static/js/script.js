document.addEventListener('DOMContentLoaded', function() {
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
              const taskList = document.getElementById('taskList');  // ID corrigido aqui
              taskList.innerHTML = ''; // Limpa a lista antes de adicionar novas tarefas
              data.forEach(task => {
                  const listItem = document.createElement('li');
                  listItem.textContent = `Nome: ${task.nome}, Custo: ${task.custo}, Data Limite: ${task.data_limite}`;
                  taskList.appendChild(listItem);
              });
          })
          .catch(error => {
              console.error('Erro ao buscar tarefas:', error);
              const taskList = document.getElementById('taskList');  // ID corrigido aqui
              taskList.innerHTML = '<li>Erro ao carregar tarefas.</li>'; // Mensagem de erro
          });
  }

  // Envio do formulário para adicionar nova tarefa
  const saveTaskButton = document.getElementById('saveTaskButton');
  saveTaskButton.addEventListener('click', async () => {
      // Obtém os dados do formulário
      const nome = document.getElementById('nome').value;
      const custo = parseFloat(document.getElementById('custo').value);
      const data_limite = document.getElementById('data_limite').value;

      // Envia a nova tarefa para o backend
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

  // Chama a função para buscar as tarefas ao carregar a página
  fetchTasks();
});
