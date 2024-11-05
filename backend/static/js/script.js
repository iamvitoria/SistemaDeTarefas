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
