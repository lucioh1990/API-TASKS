const prisma = require('../../prisma/client');
const { projectSchema, updateprojectSchema } = require('../schemas/projects.schema');

exports.criar = async (req, res) => {
  const resultado = projectSchema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error });
  }
  const { name, status, description } = req.body;
  const project = await prisma.project.create({
    data: { name, description, status }
  })
  res.status(201).json(project)
}

exports.buscaGeral = async (req, res) => {
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

}

exports.buscaId = async (req, res) => {
  const { id } = req.params
  const project = await prisma.project.findUnique({
    where: { id: Number(id) }
  })
  if (!project) {
    return res.status(404).json({ error: ' Projeto não encontrado!' })
  }
  res.json(project);

}

exports.atualizar = async (req, res) => {
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

}

exports.deletar = async (req, res) => {
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
}

exports.buscarInclude = async (req,res) => {
  const {id} = req.params;
  const project = await prisma.project.findUnique({
    where: {id: Number(id)},
    include: {tasks:true}
  });
  if(!project){
    return res.status(404).json({error: 'Id não localizado!!!'})
  }
  res.json(project);
}