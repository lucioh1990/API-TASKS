const express = require('express');
const prisma = require('./prisma/client');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();


app.use(express.json());

const categorySchema = z.object({
  name: z.string(),
  color: z.string()
})

const updatecategorySchema = z.object({
  name: z.string().optional(),
  color: z.string().optional()
})

const projectSchema = z.object({
  name: z.string(),
  status: z.string(),
  description: z.string().optional(),
})

const updateprojectSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
  description: z.string().optional(),
})


const taskSchema = z.object({
  title: z.string(),
  status: z.string(),
  description: z.string().optional(),
  priority: z.string().optional(),
  projectId: z.number().optional(),
  categoryId: z.number().optional()
})

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  projectId: z.number().optional(),
  categoryId: z.number().optional()
})

const registerSchema = z.object({
  email: z.string(),
  password: z.string()
})

const loginSchema = z.object({
  email: z.string(),
  password: z.string()
})

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não encontrado!!!' })
  }
  const token = authHeader.split(' ')[1];

  try {
    const dados = jwt.verify(token, 'minhaChaveSecreta');
    req.usuario = dados;
    next();
  } catch {
    return res.status(401).json({ error: 'Token errado!!' })
  }

}


app.post('/login', async (req, res) => {
  const resultado = loginSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error })
  }
  const { email, password } = req.body;
  const usuario = await prisma.user.findUnique({
    where: { email }
  });
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciais Invalidas' });
  }
  const senhaCorreta = await bcrypt.compare(password, usuario.password);

  if (!senhaCorreta) {
    return res.status(401).json({ error: 'Credenciais Invalidas' })
  }
  const token = jwt.sign({ id: usuario.id, email: usuario.email }, 'minhaChaveSecreta');
  return res.status(200).json({ message: 'Logado!', token });
})

app.post('/register', async (req, res) => {
  const resultado = registerSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error })
  }
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10)

  try {
    const usuario = await prisma.user.create({
      data: { email, password: hash }
    })
    return res.status(201).json({ message: 'User criado!' })
  } catch {
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
})



app.get('/', (req, res) => {
  res.send('Hello Tasks!');
});

app.get('/tasks', autenticar, async (req, res) => {
  const { title, priority, status, description, sortBy = 'id', order = 'asc', limit = 10, page = 1 } = req.query;
  const filtro = {}
  if (status) {
    filtro.status = status;
  }
  if (priority) {
    filtro.priority = priority;
  }
  const skip = (page - 1) * limit;
  const tasks = await prisma.task.findMany({
    where: filtro,
    orderBy: { [sortBy]: order },
    skip: skip,
    take: limit
  })
  res.json(tasks);
});

app.get('/tasks/:id', autenticar, async (req, res) => {
  const { id } = req.params
  const task = await prisma.task.findUnique({
    where: { id: Number(id) }
  });
  if (!task) {
    return res.status(404).json({ error: 'Não encontrado' })
  }
  res.json(task);
})

app.post('/tasks', autenticar, async (req, res) => {
  const resultado = taskSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error });
  }
  const { title, description, status, priority, projectId, categoryId } = req.body;
  const task = await prisma.task.create({
    data: { title, description, status, priority, projectId, categoryId }
  })
  res.status(201).json(task);

})

app.put('/tasks/:id', autenticar, async (req, res) => {
  const resultado = updateTaskSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error });
  }
  const { id } = req.params;
  const { title, description, status, priority,projectId, categoryId } = req.body
  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, description, status, priority,projectId, categoryId }
    })
    res.json(task)
  } catch {
    res.status(404).json({ error: 'Não encontrada' })
  }

})

app.delete('/tasks/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id: Number(id) } })
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Não encontrado' })
  }

})

app.post('/projects', autenticar, async (req, res) => {
  const resultado = categorySchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error });
  }
  const { name, status, description } = req.body;
  const project = await prisma.project.create({
    data: { name, description, status }
  })
  res.status(201).json(project)
})

app.get('/projects', autenticar, async (req, res) => {
  const { name, status, description, sortBy = 'id', order = 'asc', limit = 10, page = 1 } = req.query;
  const filtro = {};
  if (name) {
    filtro.name = name;
  }
  if (status) {
    filtro.status = status;
  }
  const skip = (page - 1) * limit;
  const project = await prisma.project.findMany({
    where: filtro,
    orderBy: { [sortBy]: order },
    skip: skip,
    take: limit
  })
  res.json(project);

})

app.get('/projects/:id', autenticar, async (req, res) => {
  const { id } = req.params
  const project = await prisma.project.findUnique({
    where: { id: Number(id) }
  })
  if (!project) {
    return res.status(404).json({ error: ' Projeto não encontrado!' })
  }
  res.json(project);

})

app.put('/projects/:id', autenticar, async (req, res) => {
  const resultado = updateprojectSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error })
  }
  const { id } = req.params;
  const { name, description, status } = req.body;

  try {
    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: { name, description, status },
    })
    res.json(project)
  } catch {
    return res.status(404).json({ error: 'Id não encontrado!' })
  }

})

app.delete('/projects/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.delete({
      where: { id: Number(id) }
    })
    res.status(204).send();
  }
  catch {
    res.status(404).json({ error: 'Id não encontrado!' })
  }
})

app.post('/categories', autenticar, async (req, res) => {
  const resultado = categorySchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error })
  }
  const { name, color } = req.body;
  const category = await prisma.category.create({
    data: { name, color }
  })
  res.status(201).json(category)
})

app.get('/categories', autenticar, async (req, res) => {
  const { name, color, sortBy = 'id', order = 'asc', page = 1, limit = 10 } = req.query;
  const filtro = {};
  if (name) {
    filtro.name = name
  }
  if (color) {
    filtro.color = color
  }
  const skip = (page - 1) * limit;
  const category = await prisma.category.findMany({
    where: filtro,
    orderBy: { [sortBy]: order },
    skip: skip,
    take: limit
  })
  res.json(category)

})

app.get('/categories/:id', autenticar, async (req, res) => {
  const { id } = req.params
  const category = await prisma.category.findUnique({
    where: { id: Number(id) }
  })
  if (!category) {
    return res.status(404).json({ error: 'Id não encontrado!!!' })
  }
  res.json(category)
})

app.put('/categories/:id', autenticar, async (req, res) => {
  const resultado = updatecategorySchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error })
  }
  const { name, color } = req.body;
  const { id } = req.params;

  try {
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, color }
    })
    res.json(category);
  }
  catch {
    return res.status(404).json({ error: 'Id não encontrado!!!' })
  }

})

app.delete('/categories/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.delete({
      where: { id: Number(id) }
    })
    res.status(204).send();
  }
  catch {
    return res.status(404).json({ error: 'Id não encontrado!!!' })
  }

})

app.get('/projects/:id/tasks', autenticar, async (req,res) => {
  const {id} = req.params;
  const project = await prisma.project.findUnique({
    where: {id: Number(id)},
    include: {tasks:true}
  });
  if(!project){
    return res.status(404).json({error: 'Id não localizado!!!'})
  }
  res.json(project);
})

app.get('/categories/:id/tasks', autenticar, async (req,res) => {
  const {id} = req.params;
  const category = await prisma.category.findUnique({
    where: {id: Number(id)},
    include: {tasks: true}
  })
  if(!category){
    return res.status(404).json({error: "Id não localizado"})
  }
  res.json(category);
})
app.listen(3000, () => {
  console.log('Servidor rodando em localhost:3000');
});