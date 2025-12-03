import { google } from 'googleapis';
import dotenv from 'dotenv';
import * as usuarioRepository from '../repository/usuarioRepository.js';

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';

// Criar cliente OAuth2
function criarOAuth2Client(accessToken, refreshToken) {
    const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        REDIRECT_URI
    );

    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    return oauth2Client;
}

// Renovar access_token se expirado
async function renovarTokenSeNecessario(usuario) {
    const agora = new Date();
    const tokenExpiry = new Date(usuario.token_expiry);

    // Se o token ainda é válido, retorna o usuário como está
    if (tokenExpiry > agora) {
        return usuario;
    }

    // Token expirado, precisa renovar
    if (!usuario.google_refresh_token) {
        throw new Error('Refresh token não disponível. Usuário precisa fazer login novamente.');
    }

    const oauth2Client = criarOAuth2Client(usuario.google_access_token, usuario.google_refresh_token);

    try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        const novoAccessToken = credentials.access_token;
        const novoExpiry = new Date(credentials.expiry_date);

        // Atualiza no banco
        await usuarioRepository.atualizarTokensGoogle(
            usuario.id,
            novoAccessToken,
            credentials.refresh_token || usuario.google_refresh_token,
            novoExpiry
        );

        // Retorna usuário com tokens atualizados
        return {
            ...usuario,
            google_access_token: novoAccessToken,
            google_refresh_token: credentials.refresh_token || usuario.google_refresh_token,
            token_expiry: novoExpiry
        };
    } catch (error) {
        console.error('Erro ao renovar token:', error);
        throw new Error('Falha ao renovar token de acesso. Usuário precisa fazer login novamente.');
    }
}

// Criar evento no Google Calendar
async function criarEvento(usuario, evento) {
    const usuarioAtualizado = await renovarTokenSeNecessario(usuario);
    const oauth2Client = criarOAuth2Client(usuarioAtualizado.google_access_token, usuarioAtualizado.google_refresh_token);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const eventoGoogle = {
        summary: evento.titulo,
        description: evento.descricao || '',
        start: {
            dateTime: evento.data_inicio,
            timeZone: 'America/Sao_Paulo',
        },
        end: {
            dateTime: evento.data_fim,
            timeZone: 'America/Sao_Paulo',
        },
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 30 },
            ],
        },
    };

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: eventoGoogle,
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao criar evento no Google Calendar:', error);
        throw new Error('Falha ao criar evento no Google Calendar');
    }
}

// Listar eventos do Google Calendar
async function listarEventos(usuario, dataInicio, dataFim) {
    const usuarioAtualizado = await renovarTokenSeNecessario(usuario);
    const oauth2Client = criarOAuth2Client(usuarioAtualizado.google_access_token, usuarioAtualizado.google_refresh_token);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: dataInicio || new Date().toISOString(),
            timeMax: dataFim,
            maxResults: 100,
            singleEvents: true,
            orderBy: 'startTime',
        });

        return response.data.items || [];
    } catch (error) {
        console.error('Erro ao listar eventos do Google Calendar:', error);
        throw new Error('Falha ao listar eventos do Google Calendar');
    }
}

// Buscar evento específico
async function buscarEvento(usuario, eventoId) {
    const usuarioAtualizado = await renovarTokenSeNecessario(usuario);
    const oauth2Client = criarOAuth2Client(usuarioAtualizado.google_access_token, usuarioAtualizado.google_refresh_token);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
        const response = await calendar.events.get({
            calendarId: 'primary',
            eventId: eventoId,
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar evento do Google Calendar:', error);
        throw new Error('Falha ao buscar evento do Google Calendar');
    }
}

// Atualizar evento
async function atualizarEvento(usuario, eventoId, evento) {
    const usuarioAtualizado = await renovarTokenSeNecessario(usuario);
    const oauth2Client = criarOAuth2Client(usuarioAtualizado.google_access_token, usuarioAtualizado.google_refresh_token);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const eventoGoogle = {
        summary: evento.titulo,
        description: evento.descricao || '',
        start: {
            dateTime: evento.data_inicio,
            timeZone: 'America/Sao_Paulo',
        },
        end: {
            dateTime: evento.data_fim,
            timeZone: 'America/Sao_Paulo',
        },
    };

    try {
        const response = await calendar.events.update({
            calendarId: 'primary',
            eventId: eventoId,
            resource: eventoGoogle,
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar evento no Google Calendar:', error);
        throw new Error('Falha ao atualizar evento no Google Calendar');
    }
}

// Deletar evento
async function deletarEvento(usuario, eventoId) {
    const usuarioAtualizado = await renovarTokenSeNecessario(usuario);
    const oauth2Client = criarOAuth2Client(usuarioAtualizado.google_access_token, usuarioAtualizado.google_refresh_token);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventoId,
        });

        return { message: 'Evento deletado com sucesso' };
    } catch (error) {
        console.error('Erro ao deletar evento do Google Calendar:', error);
        throw new Error('Falha ao deletar evento do Google Calendar');
    }
}

export {
    criarEvento,
    listarEventos,
    buscarEvento,
    atualizarEvento,
    deletarEvento
};
