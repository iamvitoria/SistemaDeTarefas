-- Reiniciar o banco de dados
DROP DATABASE IF EXISTS sistema_de_tarefas;
CREATE DATABASE sistema_de_tarefas;
USE sistema_de_tarefas;

-- Concessão de privilégios
GRANT ALL PRIVILEGES ON sistema_de_tarefas.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY '793415Ng_' WITH GRANT OPTION;
FLUSH PRIVILEGES;


-- Criação da tabela sem índice único para a coluna 'ordem'
CREATE TABLE tarefa (
    idTarefa INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    custo DECIMAL(8, 2) NOT NULL,
    dataLimite DATE NOT NULL,
    ordem INT NOT NULL
);

-- Inserção de dados na tabela 'tarefa'
INSERT INTO tarefa (nome, custo, dataLimite, ordem) VALUES 
('Estudar para o exame', 50.00, '2024-11-10', 1),
('Comprar mantimentos', 150.50, '2024-11-05', 2),
('Enviar relatório', 0.00, '2024-11-15', 3),
('Limpar a casa', 30.00, '2024-11-08', 4);

-- Verificar a estrutura e o conteúdo da tabela
SELECT * FROM tarefa;
