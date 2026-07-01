const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../prisma/client');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');

exports.register = async (req, res) => {
  const resultado = registerSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error });
  }
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: { email, password: hash }
    });
    return res.status(201).json({ message: 'User criado!' });
  } catch {
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

exports.login = async (req, res) => {
  const resultado = loginSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({ error: resultado.error });
  }
  const { email, password } = req.body;
  const usuario = await prisma.user.findUnique({ where: { email } });
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciais Invalidas' });
  }
  const senhaCorreta = await bcrypt.compare(password, usuario.password);
  if (!senhaCorreta) {
    return res.status(401).json({ error: 'Credenciais Invalidas' });
  }
  const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET);
  return res.status(200).json({ message: 'Logado!', token });
};