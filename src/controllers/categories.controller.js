const prisma = require('../../prisma/client');
const { categorySchema, updatecategorySchema } = require('../schemas/categories.schema');

exports.criar = async (req, res) => {
  const resultado = categorySchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error })
  }
  const { name, color } = req.body;
  const category = await prisma.category.create({
    data: { name, color }
  })
  res.status(201).json(category)
}

exports.buscaGeral = async (req, res) => {
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

}

exports.buscaId = async (req, res) => {
  const { id } = req.params
  const category = await prisma.category.findUnique({
    where: { id: Number(id) }
  })
  if (!category) {
    return res.status(404).json({ error: 'Id não encontrado!!!' })
  }
  res.json(category)
}

exports.atualizar = async (req, res) => {
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

}

exports.deletar = async (req, res) => {
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

}

exports.buscarInclude = async (req,res) => {
  const {id} = req.params;
  const category = await prisma.category.findUnique({
    where: {id: Number(id)},
    include: {tasks: true}
  })
  if(!category){
    return res.status(404).json({error: "Id não localizado"})
  }
  res.json(category);
}