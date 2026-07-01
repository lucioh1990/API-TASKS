const prisma = require('../../prisma/client');
const { taskSchema, updateTaskSchema } = require('../schemas/tasks.schema');



exports.buscaGeral = async (req, res) => {
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
};

exports.buscaId = async (req, res) => {
  const { id } = req.params
  const task = await prisma.task.findUnique({
    where: { id: Number(id) }
  });
  if (!task) {
    return res.status(404).json({ error: 'Não encontrado' })
  }
  res.json(task);
}

exports.criar = async (req, res) => {
  const resultado = taskSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error });
  }
  const { title, description, status, priority, projectId, categoryId } = req.body;
  const task = await prisma.task.create({
    data: { title, description, status, priority, projectId, categoryId }
  })
  res.status(201).json(task);

}

exports.atualizar = async (req, res) => {
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

}

exports.deletar = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id: Number(id) } })
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Não encontrado' })
  }

}