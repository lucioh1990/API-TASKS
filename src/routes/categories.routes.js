const { Router } = require('express');
const router = Router();
const { autenticar } = require('../middleware/autenticar');
const categoriesController = require('../controllers/categories.controller');

router.get('/', autenticar, categoriesController.buscaGeral);
router.get('/:id', autenticar, categoriesController.buscaId);
router.get('/:id/tasks', autenticar, categoriesController.buscarInclude);
router.post('/', autenticar, categoriesController.criar);
router.put('/:id', autenticar, categoriesController.atualizar);
router.delete('/:id', autenticar, categoriesController.deletar);

module.exports = router;