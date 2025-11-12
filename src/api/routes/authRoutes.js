//TESTE DE HOJE
console.log("--- [DEBUG] O arquivo authRoutes.js FOI CARREGADO ---");
import { Router } from 'express';
import passport from 'passport';
// IMPORTAÇÃO ADICIONADA: Precisamos do middleware para proteger a nova rota
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = Router();

// --- ROTA ADICIONADA ---
// Rota para o front-end verificar se o usuário está logado
// O authGuard.js vai chamar esta rota
router.get('/user', isLoggedIn, (req, res) => {
    // Se o middleware 'isLoggedIn' passar, o usuário está em req.user
    // Apenas retornamos os dados do usuário
    res.status(200).json(req.user);
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/login-falhou' }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect('/login-falhou');

        req.logIn(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            
            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error('Erro ao salvar sessão:', saveErr);
                    return next(saveErr);
                }
                // Redireciona para o frontend (configurado via .env)
                // Lembre-se de verificar se esta URL no .env está correta!
                // Deve ser: FRONTEND_URL=http://localhost:5500/dashboard.html (ou index.html)
                return res.redirect(process.env.FRONTEND_URL || 'http://localhost:5500/dashboard.html');
            });
        });
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        // Lembre-se de verificar se esta URL no .env está correta!
        // Deve ser: FRONTEND_URL_LOGIN=http://localhost:5500/login.html
        res.redirect(process.env.FRONTEND_URL_LOGIN || 'http://localhost:5500/login.html');
    });
});

// Rota de falha (pode ser removida se não for usada)
router.get('/login-falhou', (req, res) => {
    res.status(401).json({ message: 'Falha na autenticação com Google.'});
});

// Rota de debug para inspecionar cookie e sessão (remova em produção)
router.get('/debug-session', (req, res) => {
    try {
        return res.json({
            headers_cookie: req.headers.cookie || null,
            session: req.session || null,
            user: req.user || null
        });
    } catch (err) {
        return res.status(500).json({ error: String(err) });
    }
});
export default router;