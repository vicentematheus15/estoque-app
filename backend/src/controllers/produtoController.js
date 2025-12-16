const pool = require('../database/connection');

exports.listar = async (req, res) => {
  try {
    const [produtos] = await pool.query(`
      SELECT 
        p.id_produto,
        p.nome_produto,
        p.categoria,
        p.preco,
        f.nome_fornecedor
      FROM produto p
      LEFT JOIN fornecedor f ON p.id_fornecedor = f.id_fornecedor
    `);

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar produtos' });
  }
};

exports.criar = async (req, res) => {
  const { nome_produto, categoria, preco, id_fornecedor } = req.body;

  try {
    await pool.query(
      'INSERT INTO produto (nome_produto, categoria, preco, id_fornecedor) VALUES (?, ?, ?, ?)',
      [nome_produto, categoria, preco, id_fornecedor || null]
    );

    res.status(201).json({ message: 'Produto criado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const { nome_produto, categoria, preco, id_fornecedor } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE produto 
       SET nome_produto = ?, categoria = ?, preco = ?, id_fornecedor = ?
       WHERE id_produto = ?`,
      [nome_produto, categoria, preco, id_fornecedor || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
};

exports.deletar = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM produto WHERE id_produto = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar produto' });
  }
};
