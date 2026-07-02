# API Tasks — Project Tracker

API REST para gerenciamento de tarefas, projetos e categorias, com autenticação JWT, validação de dados, filtros dinâmicos, paginação e dashboard de métricas. Construída com Node.js, Express, PostgreSQL e Prisma, deployada no Railway.

## Stack

- **Node.js** — runtime JavaScript
- **Express** — framework web para criação das rotas
- **PostgreSQL** — banco de dados relacional
- **Prisma ORM** — camada de acesso ao banco (queries, migrations, modelagem de dados)
- **Zod** — validação de dados de entrada
- **bcrypt** — criptografia de senhas
- **jsonwebtoken (JWT)** — autenticação baseada em token
- **Morgan** — logging de requisições HTTP
- **CORS** — controle de acesso entre origens

## Funcionalidades

- CRUD completo de Tasks, Projects e Categories (3 entidades relacionadas)
- Relacionamentos reais no banco: Task pertence a Project e Category
- Autenticação de usuários com cadastro, login e tokens JWT
- Rotas protegidas por middleware de autenticação
- Filtros dinâmicos por status e prioridade
- Ordenação dinâmica por qualquer campo (asc ou desc)
- Paginação via query params (page e limit)
- Validação de dados com Zod antes de qualquer escrita no banco
- Senhas armazenadas como hash (nunca em texto puro)
- Endpoint de dashboard com métricas agregadas (count e groupBy)
- Estrutura profissional separada em routes, controllers, middleware e schemas
- Deploy em produção com banco remoto

## Demonstração

- **Produção:** https://api-tasks-production-802b.up.railway.app
- **Vídeo:** https://youtu.be/gSa91lSUXTI

## Collection Bruno

A collection completa com todas as rotas está disponível em `docs/Projeto Tasks.yml`. Importe no Bruno para testar a API sem configurar nada do zero.

## Estrutura do projeto

```
api-tasks/
  src/
    controllers/    — lógica de negócio de cada entidade
    middleware/     — autenticação e error handling
    routes/         — mapeamento de URLs para controllers
    schemas/        — schemas Zod de validação
  prisma/
    schema.prisma   — modelos e relações do banco
    migrations/     — histórico de migrations
  docs/
    Projeto Tasks.yml  — collection Bruno com todas as rotas
  index.js          — configuração do servidor e registro de rotas
  .env              — variáveis de ambiente (não commitado)
```

## Autenticação

O fluxo de autenticação:

1. Cadastre um usuário em `POST /register`
2. Faça login em `POST /login` para receber um token
3. Envie esse token no header `Authorization` das requisições seguintes:
   ```
   Authorization: Bearer <seu_token_aqui>
   ```

Sem um token válido, as rotas protegidas retornam `401 Unauthorized`.

## Rotas disponíveis

### Auth
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/register` | Não | Cria um novo usuário |
| POST | `/login` | Não | Autentica e retorna um token JWT |

### Tasks
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/tasks` | Sim | Lista tarefas (filtros, ordenação, paginação) |
| GET | `/tasks/:id` | Sim | Busca uma tarefa pelo ID |
| POST | `/tasks` | Sim | Cria uma nova tarefa |
| PUT | `/tasks/:id` | Sim | Atualiza uma tarefa existente |
| DELETE | `/tasks/:id` | Sim | Remove uma tarefa |

### Projects
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/projects` | Sim | Lista projetos |
| GET | `/projects/:id` | Sim | Busca um projeto pelo ID |
| GET | `/projects/:id/tasks` | Sim | Retorna projeto com tasks vinculadas |
| POST | `/projects` | Sim | Cria um novo projeto |
| PUT | `/projects/:id` | Sim | Atualiza um projeto |
| DELETE | `/projects/:id` | Sim | Remove um projeto |

### Categories
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/categories` | Sim | Lista categorias |
| GET | `/categories/:id` | Sim | Busca uma categoria pelo ID |
| GET | `/categories/:id/tasks` | Sim | Retorna categoria com tasks vinculadas |
| POST | `/categories` | Sim | Cria uma nova categoria |
| PUT | `/categories/:id` | Sim | Atualiza uma categoria |
| DELETE | `/categories/:id` | Sim | Remove uma categoria |

### Dashboard
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/dashboard` | Sim | Métricas agregadas (total, por status, prioridade e projeto) |

### Filtros e paginação em GET /tasks

| Parâmetro | Descrição | Padrão |
|---|---|---|
| `status` | Filtra por status | — |
| `priority` | Filtra por prioridade | — |
| `sortBy` | Campo usado para ordenação | `id` |
| `order` | Direção da ordenação (`asc` ou `desc`) | `asc` |
| `page` | Número da página | `1` |
| `limit` | Itens por página | `10` |

Exemplo: `GET /tasks?status=ativo&priority=high&sortBy=createdAt&order=desc&page=1&limit=5`

## Modelo de dados

```
Task
├── id          Int       (chave primária, autoincremento)
├── title       String
├── description String?
├── status      String    (padrão: "todo")
├── priority    String    (padrão: "medium")
├── projectId   Int?      (foreign key → Project)
├── categoryId  Int?      (foreign key → Category)
├── createdAt   DateTime
└── updatedAt   DateTime

Project
├── id          Int       (chave primária, autoincremento)
├── name        String
├── description String?
├── status      String    (padrão: "active")
└── tasks       Task[]    (relação hasMany)

Category
├── id    Int    (chave primária, autoincremento)
├── name  String
├── color String
└── tasks Task[] (relação hasMany)

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

3. Crie um arquivo `.env` na raiz do projeto:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
   JWT_SECRET="sua_chave_secreta_aqui"
   PORT=3000
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
```json
POST /register
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senhaForte123"
}
```

**Fazer login**
```json
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

**Criar uma tarefa vinculada a projeto e categoria** (requer token)
```json
POST /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "Estudar Prisma",
  "status": "doing",
  "priority": "high",
  "projectId": 1,
  "categoryId": 1
}
```

**Buscar projeto com tasks** (requer token)
```
GET /projects/1/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Dashboard de métricas** (requer token)
```
GET /dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Autor

[Lúcio Oliveira](https://github.com/lucioh1990)