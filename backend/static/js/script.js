document.addEventListener('DOMContentLoaded', function () {
    let selectedTaskId = null;

    // Função para buscar as tarefas do servidor e exibi-las
    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(data => renderTasks(data))
            .catch(error => {
                console.error('Erro ao buscar tarefas:', error);
                document.getElementById('taskList').innerHTML = '<tr><td colspan="5">Erro ao carregar tarefas.</td></tr>';
            });
    }

    // Função para formatar custo em moeda
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Função para formatar a data no formato dd/mm/yyyy
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function renderTasks(tasks) {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
    
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.setAttribute('data-task-id', task.id); // Adiciona o ID da tarefa como atributo de dados
            if (task.custo >= 1000) row.classList.add('highlight'); // Destacar tarefas com custo maior ou igual a 1000
    
            row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.nome}</td>
                <td>${formatCurrency(task.custo)}</td>
                <td>${formatDate(task.data_limite)}</td>
                <td>
                    <button onclick="editTask(${task.id})" class="action-btn"><i class="fas fa-pencil-alt"></i></button>
                    <button onclick="deleteTask(${task.id})" class="action-btn"><i class="fas fa-trash"></i></button>
                </td>
                <td>
                    <button onclick="reorderTask(${task.id}, 'up')">&#9650;</button>
                    <button onclick="reorderTask(${task.id}, 'down')">&#9660;</button>
                </td>
            `;
            taskList.appendChild(row);
        });
    }    

    // Função para editar uma tarefa
    window.editTask = function (taskId) {
        selectedTaskId = taskId;
        fetch(`/tasks/${taskId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('editNome').value = data.nome;
                document.getElementById('editCusto').value = data.custo;
                document.getElementById('editDataLimite').value = data.data_limite;
                document.getElementById('editPopup').style.display = 'block';
            })
            .catch(error => console.error('Erro ao buscar tarefa:', error));
    };

    // Função para atualizar uma tarefa
    document.getElementById('updateTaskButton').addEventListener('click', function () {
        const nome = document.getElementById('editNome').value;
        const custo = parseFloat(document.getElementById('editCusto').value);
        const dataLimite = document.getElementById('editDataLimite').value;

        if (!nome || !custo || !dataLimite) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        fetch(`/tasks/${selectedTaskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, custo, data_limite: dataLimite })
        })
        .then(response => response.json())
        .then(data => {
            fetchTasks();
            document.getElementById('editPopup').style.display = 'none';
        })
        .catch(error => console.error('Erro ao atualizar tarefa:', error));
    });

    // Função para excluir uma tarefa
    window.deleteTask = function (taskId) {
        if (confirm('Você tem certeza que deseja excluir esta tarefa?')) {
            fetch(`/tasks/${taskId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    // Remover a tarefa do DOM imediatamente após a confirmação de exclusão
                    document.querySelector(`tr[data-task-id="${taskId}"]`).remove();
                } else {
                    console.error('Erro ao excluir tarefa:', response.statusText);
                }
            })
            .catch(error => console.error('Erro ao excluir tarefa:', error));
        }
    };

    // Função para reordenar uma tarefa
    window.reorderTask = function(taskId, direction) {
        fetch(`/tasks/reorder/${taskId}/${direction}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(() => fetchTasks())  // Recarrega a lista para atualizar a ordem
        .catch(error => console.error('Erro ao reordenar tarefa:', error));
    };    

    // Função para incluir uma nova tarefa
    document.getElementById('saveTaskButton').addEventListener('click', function () {
        const nome = document.getElementById('newNome').value;
        const custo = parseFloat(document.getElementById('newCusto').value);
        const dataLimite = document.getElementById('newDataLimite').value;

        if (!nome || !custo || !dataLimite) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, custo, data_limite: dataLimite })
        })
        .then(response => response.json())
        .then(() => {
            fetchTasks();
            document.getElementById('newNome').value = '';
            document.getElementById('newCusto').value = '';
            document.getElementById('newDataLimite').value = '';
        })
        .catch(error => console.error('Erro ao adicionar tarefa:', error));
    });

    // Função para cancelar a edição e fechar o popup
    document.getElementById('cancelTaskButton').addEventListener('click', function () {
        document.getElementById('editPopup').style.display = 'none';
    });

    // Carregar as tarefas inicialmente
    fetchTasks();
});
