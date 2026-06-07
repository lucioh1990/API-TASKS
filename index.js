const express = require('express');
const app = express();

app.use(express.json());

const tasks = [
  {id: 1, title:'teste 1', status: 'ativo'},
  {id: 2, title: 'teste 2', status: 'ativo'},
  {id: 3, title: 'teste 3', status: 'desativado'}
]

app.get('/', (req, res) => {
  res.send('Hello Tasks!');
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req,res) => {
 const task = tasks.find(busca => busca.id === Number(req.params.id));
res.json(task);
})
app.listen(3000, () => {
  console.log('Servidor rodando em localhost:3000');
});