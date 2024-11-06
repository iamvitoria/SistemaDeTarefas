DROP DATABASE IF EXISTS sistema_de_tarefas;
CREATE DATABASE sistema_de_tarefas;
USE sistema_de_tarefas;

GRANT ALL PRIVILEGES ON sistema_de_tarefas.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE tarefa (
    idTarefa INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    custo DECIMAL(8, 2) NOT NULL,
    dataLimite DATE NOT NULL,
    ordem INT UNIQUE NOT NULL
);

INSERT INTO tarefa (nome, custo, dataLimite, ordem) VALUES ('Estudar para o exame', 50.00, '2024-11-10', 1);
INSERT INTO tarefa (nome, custo, dataLimite, ordem) VALUES ('Comprar mantimentos', 150.50, '2024-11-05', 2);
INSERT INTO tarefa (nome, custo, dataLimite, ordem) VALUES ('Enviar relatório', 0.00, '2024-11-15', 3);
INSERT INTO tarefa (nome, custo, dataLimite, ordem) VALUES ('Limpar a casa', 30.00, '2024-11-08', 4);

ALTER TABLE tarefa MODIFY COLUMN custo DECIMAL(8, 2) NOT NULL;
ALTER TABLE tarefa DROP INDEX ordem_2;
ALTER TABLE tarefa MODIFY COLUMN ordem INT NOT NULL DEFAULT 0;

SELECT * FROM tarefa;