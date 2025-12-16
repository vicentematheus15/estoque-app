const pool = require('../database/connection');

exports.entrada = async (req, res) => {
  const { id_produto_estoque, quantidade, id_usuario } = req.body;

  try {
    await pool.query(
      'UPDATE produto_estoque SET qtd_atual = qtd_atual + ? WHERE id_produto_estoque = ?',
      [quantidade, id_produto_estoque]
    );

    await pool.query(
      `INSERT INTO movimentacao_estoque 
       (tipo_movimentacao, quantidade, id_produto_estoque, id_usuario)
       VALUES ('Entrada', ?, ?, ?)`,
      [quantidade, id_produto_estoque, id_usuario]
    );

    res.json({ message: 'Entrada registrada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar entrada' });
  }
};

exports.saida = async (req, res) => {
  const { id_produto_estoque, quantidade, id_usuario } = req.body;

  try {
    const [[estoque]] = await pool.query(
      'SELECT qtd_atual FROM produto_estoque WHERE id_produto_estoque = ?',
      [id_produto_estoque]
    );

    if (estoque.qtd_atual < quantidade) {
      return res.status(400).json({ message: 'Estoque insuficiente' });
    }

    await pool.query(
      'UPDATE produto_estoque SET qtd_atual = qtd_atual - ? WHERE id_produto_estoque = ?',
      [quantidade, id_produto_estoque]
    );

    await pool.query(
      `INSERT INTO movimentacao_estoque 
       (tipo_movimentacao, quantidade, id_produto_estoque, id_usuario)
       VALUES ('Saída', ?, ?, ?)`,
      [quantidade, id_produto_estoque, id_usuario]
    );

    res.json({ message: 'Saída registrada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar saída' });
  }
};

exports.historico = async (req, res) => {
  const { id_produto_estoque } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
        m.id_movimentacao,
        m.data_movimentacao,
        m.tipo_movimentacao,
        m.quantidade,
        u.email
       FROM movimentacao_estoque m
       JOIN usuario u ON u.id_usuario = m.id_usuario
       WHERE m.id_produto_estoque = ?
       ORDER BY m.data_movimentacao DESC`,
      [id_produto_estoque]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
};
