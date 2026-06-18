API Tasks

API REST para gerenciamento de tarefas (CRUD completo), construída como projeto de estudo prático de back-end com Node.js, Express e PostgreSQL.

Stack


Node.js — runtime JavaScript
Express — framework web para criação das rotas
PostgreSQL — banco de dados relacional
Prisma ORM — camada de acesso ao banco (queries, migrations, modelagem de dados)


Funcionalidades


CRUD completo de tarefas (criar, listar, buscar, atualizar, deletar)
Filtros por status e prioridade
Busca por texto (título e descrição)
Combinação de filtros com múltiplas condições (AND / OR)
Ordenação de resultados
Tratamento de erros com status codes apropriados (200, 201, 204, 404)


Demonstração


Espaço reservado para print ou GIF mostrando as requisições funcionando no Postman.



Mostrar Imagem

Rotas disponíveis

MétodoRotaDescriçãoGET/tasksLista todas as tarefasGET/tasks/:idBusca uma tarefa pelo IDGET/tasks/status/:statusFiltra tarefas por statusGET/tasks/urgentesLista tarefas com prioridade alta e status ativoGET/tasks/buscar/:textoBusca tarefas pelo títuloGET/tasks/buscar2/:textoBusca tarefas pelo título ou descriçãoGET/tasks/ordenadasLista tarefas ordenadas por ID (decrescente)GET/tasks/status/:status/ordenadasFiltra por status e ordena por IDPOST/tasksCria uma nova tarefaPUT/tasks/:idAtualiza uma tarefa existenteDELETE/tasks/:idRemove uma tarefa

Modelo de dados

Task
├── id          Int       (chave primária, autoincremento)
├── title       String
├── description String
├── status      String
└── priority    String

Como rodar localmente

Pré-requisitos


Node.js instalado
PostgreSQL instalado e em execução (local ou via Docker)


Passos


Clone o repositório


bash   git clone https://github.com/lucioh1990/API-TASKS.git
   cd API-TASKS


Instale as dependências


bash   npm install


Crie um arquivo .env na raiz do projeto com a string de conexão do banco:


   DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"


Rode as migrations do Prisma


bash   npx prisma migrate dev


Inicie o servidor


bash   node index.js

O servidor estará disponível em http://localhost:3000.

Exemplo de uso

Criar uma tarefa

bashPOST /tasks
Content-Type: application/json

{
  "title": "Estudar Prisma",
  "description": "Revisar queries com where e orderBy",
  "status": "ativo",
  "priority": "Alta"
}

Buscar tarefas por status

bashGET /tasks/status/ativo

Status do projeto

Projeto em desenvolvimento contínuo, como parte de um roadmap estruturado de aprendizado de back-end. Próximos passos incluem filtros via query params, validação de dados com Zod e autenticação com JWT.

Autor

Lúcio Oliveira
