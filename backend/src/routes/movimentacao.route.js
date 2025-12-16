const express = require('express');
const router = express.Router();
const movimentacaoController = require('../controllers/movimentacaoController');
const permissao = require('../middlewares/permissao');

// registrar entrada
router.post('/entrada', permissao(['admin']), movimentacaoController.entrada);

// registrar saída
router.post('/saida', permissao(['admin', 'vendedor']), movimentacaoController.saida);

// histórico
router.get('/:id_produto_estoque', permissao(['admin', 'vendedor']), movimentacaoController.historico);

module.exports = router;