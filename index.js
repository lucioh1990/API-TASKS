const express = require('express');
const prisma  = require('./prisma/client')
const app = express();
let nextId = 3;

app.use(express.json());



app.get('/', (req, res) => {
  res.send('Hello Tasks!');
});

app.get('/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany()
  res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params
  const task = await prisma.task.findUnique({
    where: { id: Number(id) }
  });
  if (!task) {
    return res.status(404).json({ error: 'Não encontrado' })
  }
  res.json(task);
})

app.post('/tasks', async(req, res) => {

  const { title, description, status, priority } = req.body;

  const task = await prisma.task.create({
    data: { title, description, status, priority }
  })
     res.status(201).json(task);

})

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body
  try{
    const task = await prisma.task.update({
      where: {id: Number(id)},
      data: {title,description,status,priority}
    })
    res.json(task)
  }catch {
    res.status(404).json({error: 'Não encontrada'})
  }

})

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try{
  await prisma.task.delete({where: {id: Number(id)}})
  res.status(204).send();
  }catch {
    res.status(404).json({error: 'Não encontrado'})
  }  

})


app.listen(3000, () => {
  console.log('Servidor rodando em localhost:3000');
});