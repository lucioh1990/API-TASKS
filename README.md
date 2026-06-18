# API Tasks

API REST para gerenciamento de tarefas (CRUD completo), construída com Node.js, Express e PostgreSQL.

## Stack

- **Node.js** — runtime JavaScript
- **Express** — framework web para criação das rotas
- **PostgreSQL** — banco de dados relacional
- **Prisma ORM** — camada de acesso ao banco (queries, migrations, modelagem de dados)

## Funcionalidades

- CRUD completo de tarefas (criar, listar, buscar, atualizar, deletar)
- Filtros por status e prioridade
- Busca por texto (título e descrição)
- Combinação de filtros com múltiplas condições (AND / OR)
- Ordenação de resultados
- Tratamento de erros com status codes apropriados (200, 201, 204, 404)

## Demonstração

> _Espaço reservado para print ou GIF mostrando as requisições funcionando no Postman._

![demo](./docs/demo.gif)

## Rotas disponíveis

| Método | Rota | Descrição |
|---|---|---|
| GET | `/tasks` | Lista todas as tarefas |
| GET | `/tasks/:id` | Busca uma tarefa pelo ID |
| GET | `/tasks/status/:status` | Filtra tarefas por status |
| GET | `/tasks/urgentes` | Lista tarefas com prioridade alta e status ativo |
| GET | `/tasks/buscar/:texto` | Busca tarefas pelo título |
| GET | `/tasks/buscar2/:texto` | Busca tarefas pelo título ou descrição |
| GET | `/tasks/ordenadas` | Lista tarefas ordenadas por ID (decrescente) |
| GET | `/tasks/status/:status/ordenadas` | Filtra por status e ordena por ID |
| POST | `/tasks` | Cria uma nova tarefa |
| PUT | `/tasks/:id` | Atualiza uma tarefa existente |
| DELETE | `/tasks/:id` | Remove uma tarefa |

## Modelo de dados

```
Task
├── id          Int       (chave primária, autoincremento)
├── title       String
├── description String
├── status      String
└── priority    String
```

## Como rodar localmente

### Pré-requisitos

- Node.js instalado
- PostgreSQL instalado e em execução (local ou via Docker)

### Passos

1. Clone o repositório
   ```bash
   git clone https://github.com/lucioh1990/API-TASKS.git
   cd API-TASKS
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com a string de conexão do banco:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
   ```

4. Rode as migrations do Prisma
   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor
   ```bash
   node index.js
   ```

O servidor estará disponível em `http://localhost:3000`.

## Exemplo de uso

**Criar uma tarefa**
```bash
POST /tasks
Content-Type: application/json

{
  "title": "Estudar Prisma",
  "description": "Revisar queries com where e orderBy",
  "status": "ativo",
  "priority": "Alta"
}
```

**Buscar tarefas por status**
```bash
GET /tasks/status/ativo
```

## Autor

[Lúcio Oliveira](https://github.com/lucioh1990)
