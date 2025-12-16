module.exports = (perfisPermitidos = []) => {
  return (req, res, next) => {
    const { nivel_acesso } = req.headers;

    if (!nivel_acesso) {
      return res.status(403).json({ message: 'Nível de acesso não informado' });
    }

    if (!perfisPermitidos.includes(nivel_acesso)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    next();
  };
};
