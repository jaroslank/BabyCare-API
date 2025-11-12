export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        // Se o usuário estiver autenticado, prossiga para a próxima função (o controller).
        return next();
    }
    // Se não estiver autenticado, envie uma resposta de erro 401 (Não Autorizado).
    res.status(401).json({ message: 'Acesso não autorizado. Por favor, faça login.' });
};
