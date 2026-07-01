const { Router } = require('express');
const router = Router();
const tasksController = require('../controllers/tasks.controller');
const { autenticar } = require('../middleware/autenticar');

router.get('/', autenticar, tasksController.buscaGeral);
router.get('/:id', autenticar, tasksController.buscaId);
router.post('/', autenticar, tasksController.criar);
router.put('/:id', autenticar, tasksController.atualizar);
router.delete('/:id', autenticar, tasksController.deletar);

module.exports = router;