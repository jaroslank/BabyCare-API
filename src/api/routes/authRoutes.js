import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback
// Callback with custom handler: garante que a sessão seja salva antes do redirect
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/login-falhou' }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect('/login-falhou');

        req.logIn(user, (loginErr) => {
            if (loginErr) return next(loginErr);

            // Logs temporários para depuração — removê-los em produção
            console.log('AUTH CALLBACK - headers.cookie:', req.headers.cookie);
            console.log('AUTH CALLBACK - req.session (before save):', req.session);

            // Garante que a sessão seja persistida no store antes do redirect
            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error('Erro ao salvar sessão:', saveErr);
                    return next(saveErr);
                }

                console.log('Sessão salva; cookies setados pelo servidor (verifique Set-Cookie na resposta)');
                // Redireciona para o frontend (configurado via .env)
                return res.redirect(process.env.FRONTEND_URL || 'http://localhost:3002/index.html');
            });
        });
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('http://localhost:3002/login.html');
    });
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