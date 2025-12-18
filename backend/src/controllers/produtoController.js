const pool = require('../database/connection');

/**
 * LISTAR PRODUTOS
 */
exports.listar = async (req, res) => {
  try {
    const [produtos] = await pool.query(`
      SELECT 
        id_produto,
        nome_produto,
        categoria,
        preco,
        ativo
      FROM produto
      WHERE ativo = TRUE
      ORDER BY id_produto DESC
    `);

    return res.json(produtos);
  } catch (error) {
    console.error('ERRO LISTAR PRODUTOS:', error);
    return res.status(500).json({ message: 'Erro ao listar produtos' });
  }
};

/**
 * CRIAR PRODUTO
 */
exports.criar = async (req, res) => {
  const { nome_produto, categoria, preco } = req.body;

  if (!nome_produto || !categoria || preco === undefined) {
    return res.status(400).json({ message: 'Dados obrigatórios ausentes' });
  }

  try {
    // 1️⃣ Cria o produto
    const [result] = await pool.query(
      `INSERT INTO produto (nome_produto, categoria, preco, ativo)
       VALUES (?, ?, ?, TRUE)`,
      [nome_produto, categoria, preco]
    );

    const idProduto = result.insertId;

    // 2️⃣ Cria estoque inicial NO ESTOQUE 1
    await pool.query(
      `INSERT INTO produto_estoque 
       (id_produto, id_estoque, qtd_atual, qtd_reservada)
       VALUES (?, 1, 0, 0)`,
      [idProduto]
    );

    return res.status(201).json({
      message: 'Produto criado com sucesso',
      id_produto: idProduto
    });

  } catch (error) {
    console.error('ERRO CRIAR PRODUTO:', error);
    return res.status(500).json({
      message: 'Erro ao criar produto',
      error: error.message
    });
  }
};

/**
 * DESATIVAR PRODUTO (DELETE LÓGICO)
 */
exports.desativarProduto = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE produto SET ativo = FALSE WHERE id_produto = ?`,
      [id]
    );

    return res.json({ message: 'Produto desativado com sucesso' });
  } catch (error) {
    console.error('ERRO DESATIVAR PRODUTO:', error);
    return res.status(500).json({ message: 'Erro ao desativar produto' });
  }
};
