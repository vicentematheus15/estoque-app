const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const permissao = require('../middlewares/permissao');

// listar produtos
router.get('/', permissao(['admin', 'vendedor']), produtoController.listar);

// criar produto
router.post('/', permissao(['admin']), produtoController.criar);

// editar produto
router.put('/:id', permissao(['admin']), produtoController.atualizar);

// deletar produto
router.put('/:id/desativar', permissao(['admin']), produtoController.desativarProduto);

module.exports = router;