// Seleciona os elementos do modal
const modal = document.getElementById('add-task-modal');
const closeModalBtn = document.querySelector('.close');
const addTaskForm = document.getElementById('add-task-form');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Função para abrir o modal para adicionar nova tarefa
addTaskBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Função para fechar o modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fecha o modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Envio do formulário para adicionar nova tarefa
addTaskForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página
    
    // Obtém os dados do formulário
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const cost = parseFloat(document.getElementById('cost').value);
    const conclusionDate = document.getElementById('conclusion_date').value;

    // Envia a nova tarefa para o backend
    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                cost,
                conclusion_date: conclusionDate
            }),
        });

        if (response.ok) {
            alert('Tarefa adicionada com sucesso!');
            modal.style.display = 'none'; // Fecha o modal
            fetchTasks(); // Atualiza a lista de tarefas
        } else {
            alert('Erro ao adicionar a tarefa.');
        }
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
    }
});

// Função para buscar e exibir as tarefas
async function fetchTasks() {
    try {
        const response = await fetch('/tasks');
        const tasks = await response.json();

        // Limpa a lista de tarefas
        taskList.innerHTML = '';

        // Adiciona as tarefas na lista
        tasks.forEach((task) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            
            // Adiciona fundo amarelo se o custo for maior ou igual a 1000
            if (task.cost >= 1000) {
                taskItem.style.backgroundColor = 'yellow';
            }

            // Exibe os dados da tarefa
            taskItem.innerHTML = `
                <p><strong>Título:</strong> ${task.title}</p>
                <p><strong>Descrição:</strong> ${task.description}</p>
                <p><strong>Custo:</strong> R$${task.cost.toFixed(2)}</p>
                <p><strong>Data de Conclusão:</strong> ${task.conclusion_date}</p>
                <button onclick="editTask(${task.id})">✏️</button>
                <button onclick="deleteTask(${task.id})">🗑️</button>
            `;

            taskList.appendChild(taskItem);
        });
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
    }
}

// Função para deletar uma tarefa
async function deleteTask(id) {
    try {
        const response = await fetch(`/tasks/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Tarefa excluída com sucesso!');
            fetchTasks(); // Atualiza a lista de tarefas
        } else {
            alert('Erro ao excluir a tarefa.');
        }
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
    }
}

// Função para editar uma tarefa (abre o modal com dados da tarefa)
async function editTask(id) {
    try {
        const response = await fetch(`/tasks/${id}`);
        const task = await response.json();

        // Preenche os campos do modal com os dados da tarefa
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description;
        document.getElementById('cost').value = task.cost;
        document.getElementById('conclusion_date').value = task.conclusion_date;

        // Abre o modal para edição
        modal.style.display = 'block';

        // Altera o comportamento do formulário para salvar a edição
        addTaskForm.onsubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await fetch(`/tasks/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: document.getElementById('title').value,
                        description: document.getElementById('description').value,
                        cost: parseFloat(document.getElementById('cost').value),
                        conclusion_date: document.getElementById('conclusion_date').value
                    }),
                });

                if (response.ok) {
                    alert('Tarefa editada com sucesso!');
                    modal.style.display = 'none';
                    fetchTasks();
                } else {
                    alert('Erro ao editar a tarefa.');
                }
            } catch (error) {
                console.error('Erro ao editar tarefa:', error);
            }
        };
    } catch (error) {
        console.error('Erro ao buscar tarefa para edição:', error);
    }
}

// Inicializa a lista de tarefas ao carregar a página
window.onload = fetchTasks;
