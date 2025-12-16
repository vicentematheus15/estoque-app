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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
};