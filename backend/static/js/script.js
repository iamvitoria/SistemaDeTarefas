document.addEventListener('DOMContentLoaded', function() {
    let selectedTaskId = null;

    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(data => renderTasks(data))
            .catch(error => {
                console.error('Erro ao buscar tarefas:', error);
                document.getElementById('taskList').innerHTML = '<tr><td colspan="5">Erro ao carregar tarefas.</td></tr>';
            });
    }

    function renderTasks(tasks) {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const row = document.createElement('tr');
            if (task.custo >= 1000) row.classList.add('highlight');

            row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.nome}</td>
                <td>${task.custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>${task.data_limite}</td>
                <td>
                    <i class="fas fa-edit edit-icon" data-id="${task.id}" title="Editar"></i>
                    <i class="fas fa-trash delete-icon" data-id="${task.id}" title="Deletar"></i>
                </td>
            `;

            // Adiciona evento de clique na linha para selecionar a tarefa
            row.addEventListener('click', () => {
                selectTask(task.id);
            });

            taskList.appendChild(row);
        });

        // Adiciona eventos de clique para os ícones de editar e excluir
        document.querySelectorAll('.edit-icon').forEach(icon => {
            icon.addEventListener('click', (event) => {
                event.stopPropagation(); // Previne que o evento clique na linha seja acionado
                openEditPopup(icon.dataset.id);
            });
        });

        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', (event) => {
                event.stopPropagation(); // Previne que o evento clique na linha seja acionado
                const taskId = icon.dataset.id;
                if (confirm('Tem certeza de que deseja excluir esta tarefa?')) {
                    fetch(`/tasks/${taskId}`, { method: 'DELETE' })
                        .then(response => response.ok && fetchTasks())
                        .catch(error => console.error('Erro ao deletar tarefa:', error));
                }
            });
        });
    }

    function selectTask(taskId) {
        selectedTaskId = taskId; // Apenas armazena o ID da tarefa selecionada
        document.querySelectorAll('#taskList tr').forEach(item => item.classList.remove('selected'));
    }

    document.getElementById('saveTaskButton').addEventListener('click', async () => {
        // ... (Código existente)
    });

    function openEditPopup(taskId) {
        fetch(`/tasks/${taskId}`)
            .then(response => response.json())
            .then(task => {
                document.getElementById('editNome').value = task.nome;
                document.getElementById('editCusto').value = task.custo;
                document.getElementById('editDataLimite').value = task.data_limite;
                document.getElementById('editPopup').style.display = 'flex';
                selectedTaskId = task.id; // Armazena o ID da tarefa que está sendo editada
            })
            .catch(error => console.error('Erro ao buscar tarefa para edição:', error));
    }

    document.getElementById('updateTaskButton').addEventListener('click', async () => {
        const nome = document.getElementById('editNome').value;
        const custo = parseFloat(document.getElementById('editCusto').value);
        const data_limite = document.getElementById('editDataLimite').value;

        try {
            const response = await fetch(`/tasks/${selectedTaskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, custo, data_limite }),
            });

            if (response.ok) {
                alert('Tarefa atualizada com sucesso!');
                fetchTasks();
                closeEditPopup();
            } else {
                alert('Erro ao atualizar a tarefa.');
            }
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    });

    function closeEditPopup() {
        document.getElementById('editPopup').style.display = 'none';
    }

    fetchTasks();
});