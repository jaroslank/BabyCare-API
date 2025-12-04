import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import * as usuarioRepository from '../api/repository/usuarioRepository.js';

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/auth/google/callback` : 'https://babycare-api.onrender.com/auth/google/callback');

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('Aviso: GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não estão configurados. O login via Google não funcionará até isso ser definido.');
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
    accessType: 'offline',
    prompt: 'consent'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const googleId = profile.id;
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        const nome = profile.displayName || (profile.name && `${profile.name.givenName} ${profile.name.familyName}`) || 'Usuário Google';
        const avatarUrl = profile.photos && profile.photos[0] && profile.photos[0].value;

        // Tenta achar usuário existente
        let usuario = await usuarioRepository.buscarPorGoogleId(googleId);
        if (usuario) {
            // Atualiza o avatar_url caso tenha mudado
            if (avatarUrl && usuario.avatar_url !== avatarUrl) {
                await usuarioRepository.atualizarAvatar(usuario.id, avatarUrl);
                usuario.avatar_url = avatarUrl;
            }
            // Atualiza tokens do Google Calendar
            if (accessToken) {
                const tokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hora de validade
                await usuarioRepository.atualizarTokensGoogle(usuario.id, accessToken, refreshToken, tokenExpiry);
                usuario.google_access_token = accessToken;
                usuario.google_refresh_token = refreshToken || usuario.google_refresh_token;
            }
            return done(null, usuario);
        }

        // Se não existe, cria um novo usuário
        const tokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hora de validade
        const novoUsuario = {
            nome,
            email,
            googleId,
            avatarUrl,
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
            tokenExpiry
        };

        usuario = await usuarioRepository.criar(novoUsuario);
        return done(null, usuario);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    // Armazena somente o id na sessão
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await usuarioRepository.buscarPorId(id);
        return done(null, usuario || null);
    } catch (err) {
        return done(err);
    }
});
