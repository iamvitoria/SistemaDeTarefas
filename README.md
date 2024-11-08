# Sistema de Gerenciamento de Tarefas

Este é um projeto de aplicação web para gerenciar tarefas utilizando Flask, SQLAlchemy, e MySQL. A aplicação permite adicionar, editar, visualizar, excluir e reordenar tarefas com informações de nome, custo e data limite.

## Funcionalidades

- **Adicionar Tarefas**: Inclua novas tarefas com informações detalhadas.
- **Listar Tarefas**: Veja todas as tarefas listadas em ordem.
- **Editar Tarefas**: Edite os detalhes de qualquer tarefa existente.
- **Excluir Tarefas**: Remova tarefas que não são mais necessárias.
- **Reordenar Tarefas**: Altere a ordem das tarefas na lista.
- **Destaque de Tarefas**: Tarefas com custo acima de 1000 são destacadas na interface.

## Estrutura do Projeto

- `app.py`: Código principal da aplicação Flask, contendo as rotas e a lógica de manipulação de tarefas.
- `templates/index.html`: Template HTML que renderiza a interface de gerenciamento de tarefas.
- `static/style.css`: Arquivo CSS para estilização da interface.
- `static/script.js`: Código JavaScript para manipulação da interface e interações.
- **Banco de Dados**: Um arquivo SQL para configuração do banco de dados está disponível para download no repositório.

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/iamvitoria/SistemaDeTarefas.git
   cd sistema-de-tarefas
   ```

2. **Instale as dependências**:
   ```bash
   pip install flask flask_sqlalchemy flask_cors pymysql
   ```

3. **Configure o Banco de Dados**:
   - Certifique-se de que o MySQL está instalado e em execução.
   - Crie o banco de dados executando o script SQL disponível no repositório:
     - No MySQL, execute o script SQL do banco de dados fornecido para configurar o banco e as tabelas necessárias.

4. **Atualize as Configurações de Conexão**:
   - Verifique e ajuste as credenciais de conexão no arquivo `app.py` conforme suas configurações do MySQL.

5. **Inicialize o Banco de Dados**:
   - Com o terminal aberto na pasta do projeto, execute:
     ```bash
     python
     ```
   - No ambiente Python, execute:
     ```python
     from app import db
     db.create_all()
     ```

6. **Execute a aplicação**:
   ```bash
   python app.py
   ```
   - Acesse a aplicação em [http://localhost:5000](http://localhost:5000).

## Uso

1. **Página Inicial**: A página inicial (`index.html`) exibe uma lista de todas as tarefas.
2. **Adicionar e Editar Tarefas**: Use o formulário na interface para adicionar ou editar tarefas.
3. **Reordenar Tarefas**: Clique nos botões para mover tarefas para cima ou para baixo na lista.
4. **Excluir Tarefas**: Clique no ícone de lixeira para remover uma tarefa.

## Dependências

- Flask
- Flask SQLAlchemy
- Flask CORS
- PyMySQL

## Configuração e Estilo

A interface possui um design simples, com estilização em `style.css` e uma funcionalidade de destaque para tarefas de alto custo.
