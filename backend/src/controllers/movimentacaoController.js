const pool = require('../database/connection');

/* =========================
   ENTRADA DE ESTOQUE
========================= */
exports.entrada = async (req, res) => {
  const { id_produto_estoque, quantidade, id_usuario, descricao } = req.body;

  if (!id_produto_estoque || !quantidade || !id_usuario) {
    return res.status(400).json({ message: 'Dados obrigatórios não informados' });
  }

  try {
    /* 1️⃣ Verificar se produto existe e está ativo */
    const [produto] = await pool.query(`
      SELECT p.ativo
      FROM produto p
      JOIN produto_estoque pe ON pe.id_produto = p.id_produto
      WHERE pe.id_produto_estoque = ?
    `, [id_produto_estoque]);

    if (produto.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado no estoque' });
    }

    if (!produto[0].ativo) {
      return res.status(400).json({
        message: 'Produto inativo. Não é possível movimentar estoque.'
      });
    }

    /* 2️⃣ Atualizar estoque (entrada soma) */
    await pool.query(
      'UPDATE produto_estoque SET qtd_atual = qtd_atual + ? WHERE id_produto_estoque = ?',
      [quantidade, id_produto_estoque]
    );

    /* 3️⃣ Registrar movimentação */
    await pool.query(`
      INSERT INTO movimentacao_estoque
      (tipo_movimentacao, descricao, quantidade, id_produto_estoque, id_usuario)
      VALUES ('Entrada', ?, ?, ?, ?)
    `, [descricao || null, quantidade, id_produto_estoque, id_usuario]);

    return res.json({ message: 'Entrada registrada com sucesso' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao registrar entrada' });
  }
};


/* =========================
   SAÍDA DE ESTOQUE
========================= */
exports.saida = async (req, res) => {
  const { id_produto_estoque, quantidade, id_usuario, descricao } = req.body;

  if (!id_produto_estoque || !quantidade || !id_usuario) {
    return res.status(400).json({ message: 'Dados obrigatórios não informados' });
  }

  try {
    /* 1️⃣ Verificar produto, estoque e status */
    const [produto] = await pool.query(`
      SELECT p.ativo, pe.qtd_atual
      FROM produto p
      JOIN produto_estoque pe ON pe.id_produto = p.id_produto
      WHERE pe.id_produto_estoque = ?
    `, [id_produto_estoque]);

    if (produto.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado no estoque' });
    }

    if (!produto[0].ativo) {
      return res.status(400).json({
        message: 'Produto inativo. Não é possível movimentar estoque.'
      });
    }

    /* 2️⃣ Validar quantidade */
    if (produto[0].qtd_atual < quantidade) {
      return res.status(400).json({ message: 'Estoque insuficiente' });
    }

    /* 3️⃣ Atualizar estoque (saída subtrai) */
    await pool.query(
      'UPDATE produto_estoque SET qtd_atual = qtd_atual - ? WHERE id_produto_estoque = ?',
      [quantidade, id_produto_estoque]
    );

    /* 4️⃣ Registrar movimentação */
    await pool.query(`
      INSERT INTO movimentacao_estoque
      (tipo_movimentacao, descricao, quantidade, id_produto_estoque, id_usuario)
      VALUES ('Saída', ?, ?, ?, ?)
    `, [descricao || null, quantidade, id_produto_estoque, id_usuario]);

    return res.json({ message: 'Saída registrada com sucesso' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao registrar saída' });
  }
};


/* =========================
   HISTÓRICO DE MOVIMENTAÇÕES
========================= */
exports.historico = async (req, res) => {
  try {
    const [movimentacoes] = await pool.query(`
      SELECT 
        me.id_movimentacao,
        me.data_movimentacao,
        me.tipo_movimentacao,
        me.descricao,
        me.quantidade,
        u.email AS usuario,
        p.nome_produto
      FROM movimentacao_estoque me
      JOIN usuario u ON me.id_usuario = u.id_usuario
      JOIN produto_estoque pe ON me.id_produto_estoque = pe.id_produto_estoque
      JOIN produto p ON pe.id_produto = p.id_produto
      ORDER BY me.data_movimentacao DESC
    `);

    return res.json(movimentacoes);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
};