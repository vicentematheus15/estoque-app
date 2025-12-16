const pool = require('../database/connection');

exports.criar = async (req, res) => {
  const { id_produto, id_estoque, qtd_atual } = req.body;

  try {
    await pool.query(
      `INSERT INTO produto_estoque 
       (id_produto, id_estoque, qtd_atual, qtd_reservada)
       VALUES (?, ?, ?, 0)`,
      [id_produto, id_estoque, qtd_atual]
    );

    res.status(201).json({ message: 'Estoque criado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar estoque' });
  }
};

exports.consultar = async (req, res) => {
  const { id_produto } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
        pe.id_produto_estoque,
        e.nome_estoque,
        pe.qtd_atual,
        pe.qtd_reservada
       FROM produto_estoque pe
       JOIN estoque e ON e.id_estoque = pe.id_estoque
       WHERE pe.id_produto = ?`,
      [id_produto]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao consultar estoque' });
  }
};
