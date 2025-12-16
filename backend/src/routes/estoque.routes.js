const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');
const permissao = require('../middlewares/permissao');

// ver estoque de um produto
router.get('/:id_produto', permissao(['admin', 'vendedor']), estoqueController.consultar);

// criar vínculo produto + estoque (admin)
router.post('/', permissao(['admin']), estoqueController.criar);

module.exports = router;