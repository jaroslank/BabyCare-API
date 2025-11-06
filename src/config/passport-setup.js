import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import * as usuarioRepository from '../api/repository/usuarioRepository.js';

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/auth/google/callback` : 'http://localhost:3000/auth/google/callback');

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('Aviso: GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não estão configurados. O login via Google não funcionará até isso ser definido.');
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const googleId = profile.id;
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        const nome = profile.displayName || (profile.name && `${profile.name.givenName} ${profile.name.familyName}`) || 'Usuário Google';

        // Tenta achar usuário existente
        let usuario = await usuarioRepository.buscarPorGoogleId(googleId);
        if (usuario) {
            return done(null, usuario);
        }

        // Se não existe, cria um novo usuário
        const novoUsuario = {
            nome,
            email,
            googleId
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
