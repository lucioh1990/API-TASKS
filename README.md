# API Tasks

API REST para gerenciamento de tarefas (CRUD completo), com autenticação JWT, validação de dados e filtros dinâmicos. Construída com Node.js, Express, PostgreSQL e Prisma.

## Stack

- **Node.js** — runtime JavaScript
- **Express** — framework web para criação das rotas
- **PostgreSQL** — banco de dados relacional
- **Prisma ORM** — camada de acesso ao banco (queries, migrations, modelagem de dados)
- **Zod** — validação de dados de entrada
- **bcrypt** — criptografia de senhas
- **jsonwebtoken (JWT)** — autenticação baseada em token

## Funcionalidades

- CRUD completo de tarefas (criar, listar, buscar, atualizar, deletar)
- Autenticação de usuários com cadastro, login e tokens JWT
- Rotas de tarefas protegidas por middleware de autenticação
- Filtros dinâmicos na listagem de tarefas (por status e prioridade)
- Ordenação dinâmica dos resultados (por qualquer campo, asc ou desc)
- Validação de dados de entrada com Zod antes de qualquer escrita no banco
- Senhas armazenadas como hash (nunca em texto puro)
- Tratamento de erros com status codes apropriados (200, 201, 204, 400, 401, 404, 500)

## Demonstração

> _Espaço reservado para print ou GIF mostrando as requisições funcionando no Postman._

![demo](./docs/demo.gif)

## Autenticação

A maioria das rotas de tarefas exige autenticação. O fluxo é:

1. Cadastre um usuário em `POST /register`
2. Faça login em `POST /login` para receber um token
3. Envie esse token no header `Authorization` das requisições seguintes:
   ```
   Authorization: Bearer <seu_token_aqui>
   ```

Sem um token válido, as rotas protegidas retornam `401 Unauthorized`.

## Rotas disponíveis

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/register` | Não | Cria um novo usuário |
| POST | `/login` | Não | Autentica e retorna um token JWT |
| GET | `/tasks` | Sim | Lista tarefas, com filtros e ordenação opcionais |
| GET | `/tasks/:id` | Sim | Busca uma tarefa pelo ID |
| POST | `/tasks` | Sim | Cria uma nova tarefa |
| PUT | `/tasks/:id` | Sim | Atualiza uma tarefa existente |
| DELETE | `/tasks/:id` | Sim | Remove uma tarefa |

### Filtros e ordenação em GET /tasks

A listagem de tarefas aceita query params opcionais:

| Parâmetro | Descrição | Padrão |
|---|---|---|
| `status` | Filtra por status | — |
| `priority` | Filtra por prioridade | — |
| `sortBy` | Campo usado para ordenação | `id` |
| `order` | Direção da ordenação (`asc` ou `desc`) | `asc` |

Exemplo: `GET /tasks?status=ativo&sortBy=priority&order=desc`

## Modelo de dados

```
Task
├── id          Int       (chave primária, autoincremento)
├── title       String
├── description String?
├── status      String    (padrão: "todo")
├── priority    String    (padrão: "medium")
├── createdAt   DateTime
└── updatedAt   DateTime

User
├── id       Int    (chave primária, autoincremento)
├── email    String (único)
└── password String (hash, nunca em texto puro)
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

## Exemplos de uso

**Cadastrar um usuário**
```bash
POST /register
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senhaForte123"
}
```

**Fazer login**
```bash
POST /login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senhaForte123"
}
```
Resposta:
```json
{
  "message": "Logado!",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Criar uma tarefa** (requer token)
```bash
POST /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "Estudar Prisma",
  "description": "Revisar queries com where e orderBy",
  "status": "ativo",
  "priority": "Alta"
}
```

**Listar tarefas com filtro e ordenação** (requer token)
```bash
GET /tasks?status=ativo&sortBy=priority&order=desc
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Autor

[Lúcio Oliveira
