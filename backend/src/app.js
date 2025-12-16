const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const produtoRoutes = require('./routes/produto.routes');
const estoqueRoutes = require('./routes/estoque.routes');
const movimentacaoRoutes = require('./routes/movimentacao.routes');


const app = express();

app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/produtos', produtoRoutes);
app.use('/estoque', estoqueRoutes);
app.use('/movimentacoes', movimentacaoRoutes);


module.exports = app;