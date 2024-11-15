const backendUrl = "https://iamvitoria.pythonanywhere.com";  // Definir a URL corretamente

document.addEventListener('DOMContentLoaded', () => {
    // Função para obter todas as tarefas do backend
    async function fetchTasks() {
        try {
            const response = await fetch(`${backendUrl}/tasks`);
            const tasks = await response.json();
            renderTasks(tasks);  // Passa as tarefas para a função renderTasks
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    }

    // Função para adicionar uma nova tarefa
    async function addTask(task) {
        try {
            const response = await fetch(`${backendUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
            const newTask = await response.json();
            console.log('Tarefa adicionada:', newTask);
            fetchTasks();  // Recarrega a lista de tarefas após adicionar uma nova
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    }

    // Função para editar uma tarefa
    window.editTask = async function (taskId) {
        selectedTaskId = taskId;
        try {
            const response = await fetch(`${backendUrl}/tasks/${taskId}`);
            const data = await response.json();
            document.getElementById('editNome').value = data.nome;
            document.getElementById('editCusto').value = data.custo;
            document.getElementById('editDataLimite').value = data.data_limite;
            document.getElementById('editPopup').style.display = 'block';
        } catch (error) {
            console.error('Erro ao buscar tarefa:', error);
        }
    };

    // Função para atualizar uma tarefa
    document.getElementById('updateTaskButton').addEventListener('click', async function () {
        const nome = document.getElementById('editNome').value;
        const custo = parseFloat(document.getElementById('editCusto').value);
        const dataLimite = document.getElementById('editDataLimite').value;

        if (!nome || !custo || !dataLimite) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/tasks/${selectedTaskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, custo, data_limite: dataLimite }),
            });
            const updatedTask = await response.json();
            console.log('Tarefa atualizada:', updatedTask);
            fetchTasks();
            document.getElementById('editPopup').style.display = 'none';
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    });

    // Função para excluir uma tarefa
    window.deleteTask = async function (taskId) {
        if (confirm('Você tem certeza que deseja excluir esta tarefa?')) {
            try {
                const response = await fetch(`${backendUrl}/tasks/${taskId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    document.querySelector(`tr[data-task-id="${taskId}"]`).remove();
                } else {
                    console.error('Erro ao excluir tarefa:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao excluir tarefa:', error);
            }
        }
    };

    // Função para reordenar uma tarefa
    window.reorderTask = async function (taskId, direction) {
        try {
            const response = await fetch(`${backendUrl}/tasks/reorder/${taskId}/${direction}`, {
                method: 'POST',
            });
            const data = await response.json();
            console.log('Tarefa reordenada:', data);
            fetchTasks();  // Recarrega as tarefas para refletir a nova ordem
        } catch (error) {
            console.error('Erro ao reordenar tarefa:', error);
        }
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

        const newTask = {
            nome: nome,
            custo: custo,
            data_limite: dataLimite
        };
        
        addTask(newTask);  // Chama a função addTask para adicionar a nova tarefa
    });

    // Função para cancelar a edição e fechar o popup
    document.getElementById('cancelTaskButton').addEventListener('click', function () {
        document.getElementById('editPopup').style.display = 'none';
    });

    // Carregar as tarefas inicialmente
    fetchTasks();
});
