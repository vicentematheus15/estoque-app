const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const permissao = require('../middlewares/permissao');

// listar produtos (admin e vendedor)
router.get('/', permissao(['admin', 'vendedor']), produtoController.listar);

// criar produto (admin)
router.post('/', permissao(['admin']), produtoController.criar);

module.exports = router;