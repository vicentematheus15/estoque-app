# 📦 Backend – Sistema de Gestão de Estoque

## 🎯 Visão Geral

Backend desenvolvido em **Node.js + Express + MySQL**, com foco em simplicidade e boas práticas. O sistema controla **produtos, estoque e movimentações**, com **controle de acesso por nível de usuário** (admin e vendedor).

Projeto pensado para:

* Trabalho de faculdade
* Portfólio no GitHub
* Base realista para app mobile (React Native / Expo)

---

## 🛠️ Tecnologias Utilizadas

* **Node.js**
* **Express**
* **MySQL**
* **bcryptjs** (hash de senha)
* **cors**
* **nodemon** (ambiente dev)

Sem TypeScript (intencional, para reduzir complexidade).

---

## 🗂️ Estrutura de Pastas

```
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── produtoController.js
│   │   └── movimentacaoController.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── produto.routes.js
│   │   └── movimentacao.routes.js
│   ├── middlewares/
│   │   └── permissao.js
│   └── database/
│       └── connection.js
└── package.json
```

---

## 👤 Tipos de Usuário

### Admin

* Login
* Cadastrar produtos
* Editar produtos
* Desativar produtos
* Registrar entrada e saída de estoque
* Visualizar histórico

### Vendedor

* Login
* Visualizar produtos
* Registrar saída de estoque
* Visualizar histórico

---

## 🔐 Autenticação

### Endpoint

```
POST /auth/login
```

### Body

```json
{
  "email": "admin@email.com",
  "senha": "123456"
}
```

### Retorno

```json
{
  "id_usuario": 1,
  "email": "admin@email.com",
  "nivel_acesso": "admin"
}
```

---

## 📦 Produtos

### Listar produtos (ativos)

```
GET /produtos
```

Apenas produtos com `ativo = true` são retornados.

---

### Criar produto (admin)

```
POST /produtos
```

---

### Editar produto (admin)

```
PUT /produtos/:id
```

---

### Desativar produto (soft delete – admin)

```
PUT /produtos/:id/desativar
```

📌 Produto não é removido do banco, apenas marcado como inativo.

---

## 🏬 Estoque

O estoque é controlado pela tabela `produto_estoque`, associando:

* Produto
* Quantidade atual
* Quantidade reservada

---

## 🔄 Movimentações de Estoque

### Entrada (admin)

```
POST /movimentacoes/entrada
```

Valida:

* Produto existente
* Produto ativo

---

### Saída (admin e vendedor)

```
POST /movimentacoes/saida
```

Valida:

* Produto ativo
* Estoque suficiente

---

### Histórico geral

```
GET /movimentacoes/historico
```

Retorna todas as movimentações registradas, ordenadas por data.

---

## 🧠 Regras de Negócio Implementadas

* Produto inativo **não pode** ter movimentação
* Estoque **não pode ficar negativo**
* Produtos com histórico **não são deletados**
* Controle de acesso por middleware
* Histórico preservado para auditoria

---

## 🧩 Middleware de Permissão

Middleware simples baseado em `nivel_acesso` enviado no header:

```
nivel_acesso: admin | vendedor
```

Garante que cada rota só seja acessada por usuários autorizados.

---
