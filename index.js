const express = require('express');
const app = express();
let nextId = 1;

app.use(express.json());

let tasks = [
  {id: 1, title:'teste 1', description: 'descrição 1', status: 'ativo', priority: 'Alta'},
  {id: 2, title: 'teste 2', description: 'descrição 2', status: 'inativo', priority: 'Media'},
]

app.get('/', (req, res) => {
  res.send('Hello Tasks!');
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req,res) => {
 const task = tasks.find(busca => busca.id === Number(req.params.id));
 if(!task){
  return res.status(404).json({error: 'Não encontrado'})
 }
res.json(task);
})

app.post('/tasks',(req,res) =>{

    const {title, description, status, priority} = req.body;

    const newTask = {
      id: nextId++,
      title: title,
      description: description,
      status: status,
      priority: priority,
    }
    tasks.push(newTask);

    res.status(201).json(newTask);

})

app.put('/tasks/:id', (req, res) =>{
  const {id} = req.params;
  const { title, description, status, priority } = req.body
  const index = tasks.findIndex(t => t.id === Number(id));
  if (index === -1){
    return res.status(404).json({error: 'Não encontrado'})
  }
  tasks[index] = {
    ...tasks[index],
    title,
    description,
    status,
    priority
  }
  res.json(tasks[index]);

})

app.delete('/tasks/:id', (req,res) =>{
   const {id} = req.params;

   const tasksExists = tasks.find(t => t.id === Number(id));
   if (!tasksExists){
    return res.status(404).json({error: 'Não encontrado'});
   }
    tasks = tasks.filter(t => t.id !== Number(id));

   res.status(204).send();


})


app.listen(3000, () => {
  console.log('Servidor rodando em localhost:3000');
});