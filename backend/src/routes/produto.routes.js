const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const permissao = require('../middlewares/permissao');

router.get('/', permissao(['admin', 'vendedor']), produtoController.listar);
router.post('/', permissao(['admin']), produtoController.criar);
router.put('/:id/desativar', permissao(['admin']), produtoController.desativarProduto);

// editar produto
//router.put('/:id', permissao(['admin']), produtoController.atualizar);

module.exports = router;