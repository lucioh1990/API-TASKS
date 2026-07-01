const { Router } = require('express');
const router = Router();
const dashboardController = require('../controllers/dashboard.controller');
const { autenticar } = require('../middleware/autenticar');

router.get('/', autenticar, dashboardController.getDashboard);

module.exports = router;