const express = require('express');
const prisma  = require('./prisma/client');
const {z} = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();


app.use(express.json());

const registerSchema = z.object({
  email: z.string(),
  password: z.string()
})

const loginSchema = z.object({
  email: z.string(),
  password: z.string()
})

function autenticar(req,res,next){
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({error: 'Token não encontrado!!!'})
  }
  const token = authHeader.split(' ')[1];

  try{
    const dados = jwt.verify(token,'minhaChaveSecreta');
    req.usuario = dados;
    next();
  } catch{
    return res.status(401).json({error: 'Token errado!!'})
  }

}


  app.post('/login', async (req,res) =>{
    const resultado = loginSchema.safeParse(req.body);

    if(!resultado.success){
      return res.status(400).json({error: resultado.error})
    }
    const {email, password} = req.body;
    const usuario = await prisma.user.findUnique({
      where: {email}
    });
    if(!usuario){
      return res.status(401).json({error: 'Credenciais Invalidas'});
    }
    const senhaCorreta = await bcrypt.compare(password,usuario.password);

    if(!senhaCorreta){
      return res.status(401).json({error: 'Senha Incorreta'})
    }
    const token = jwt.sign({id: usuario.id, email: usuario.email}, 'minhaChaveSecreta');
    return res.status(200).json({message: 'Logado!', token});
  })

app.post('/register', async (req,res) =>{
  const resultado = registerSchema.safeParse(req.body);

  if(!resultado.success){
    return res.status(400).json({error: resultado.error})
  }
  const {email, password} = req.body;
  const hash = await bcrypt.hash(password,10)

  try{
    const usuario = await prisma.user.create({
      data: {email,password: hash}
    })
  return res.status(201).json({message: 'User criado!'})
} catch (erro) {
  console.log(erro);
  return res.status(500).json({ error: 'Erro ao criar usuário' });
}})



app.get('/', (req, res) => {
  res.send('Hello Tasks!');
});

app.get('/tasks', autenticar, async (req, res) => {
  const tasks = await prisma.task.findMany()
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

app.post('/tasks',autenticar, async(req, res) => {

  const { title, description, status, priority } = req.body;

  const task = await prisma.task.create({
    data: { title, description, status, priority }
  })
     res.status(201).json(task);

})

app.put('/tasks/:id', autenticar, async (req, res) => {
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

app.delete('/tasks/:id', autenticar, async (req, res) => {
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