require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const tasksRoutes = require('./src/routes/tasks.routes');
const projectsRoutes = require('./src/routes/projects.routes');
const categoriesRoutes = require('./src/routes/categories.routes');
const authRoutes = require('./src/routes/auth.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const { errorHandler } = require('./src/middleware/errorHandler');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello Tasks!');
});

app.use('/tasks', tasksRoutes);
app.use('/projects', projectsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);


app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando em localhost:3000');
});