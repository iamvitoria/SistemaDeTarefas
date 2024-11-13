# Projeto Flask com MySQL

Este é um projeto básico utilizando Flask como framework web e MySQL como banco de dados. O objetivo do projeto é demonstrar a integração entre Flask e um banco de dados MySQL, além de aplicar migrações de banco de dados usando Flask-Migrate.

## Requisitos

Antes de rodar o projeto, instale as dependências do projeto utilizando o arquivo `requirements.txt`:

1. Clone o repositório para a sua máquina local:
   ```bash
   git clone https://github.com/iamvitoria/SistemaDeTarefas.git
   ```

2. Entre no diretório do projeto:
   ```bash
   cd backend
   ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Execute o projeto
    python app.py

## Configuração do Banco de Dados

1. Crie um banco de dados MySQL em sua máquina local com o nome desejado.
2. Configure as credenciais de acesso no seu arquivo de configuração Flask.

Exemplo de configuração no seu app (geralmente em `app.py` ou `config.py`):

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://usuario:senha@localhost/nome_do_banco'
```

## Migrações

Para criar e gerenciar migrações do banco de dados, use o Flask-Migrate. Siga os passos abaixo para inicializar e aplicar migrações:

1. Inicialize o diretório de migrações:
   ```bash
   flask db init
   ```

2. Crie uma nova migração:
   ```bash
   flask db migrate -m "Descrição da migração"
   ```

3. Aplique a migração no banco de dados:
   ```bash
   flask db upgrade
   ```

## Rodando o Projeto

Para rodar o projeto localmente, use o comando:

```bash
flask run
```

O servidor estará disponível em `http://127.0.0.1:5000/`.

### Personalização:

- **Configuração do banco de dados**: Substitua o exemplo de configuração do banco de dados pela URL correta do seu banco de dados.
- **Estrutura do projeto**: A estrutura pode variar dependendo da sua organização de arquivos. Adapte conforme a estrutura do seu projeto.
- **Migrações**: Caso você esteja utilizando algum sistema diferente para migrações, adicione os passos relevantes no lugar do Flask-Migrate.