const { Router } = require('express');
const router = Router();
const projectsController = require('../controllers/projects.controller');
const { autenticar } = require('../middleware/autenticar');

router.get('/', autenticar, projectsController.buscaGeral);
router.get('/:id', autenticar, projectsController.buscaId);
router.get('/:id/tasks', autenticar, projectsController.buscarInclude);
router.post('/', autenticar, projectsController.criar);
router.put('/:id', autenticar, projectsController.atualizar);
router.delete('/:id', autenticar, projectsController.deletar);

module.exports = router;