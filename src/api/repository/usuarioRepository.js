import pool from '../../config/database.js';

// Helper para reutilizar a busca
async function buscarPorId(id) {
    if (!id) return null;
    // Seleciona todas as colunas da tabela (aceita UUIDs ou strings)
    const { rows } = await pool.query('SELECT id, nome, email, google_id, avatar_url, google_access_token, google_refresh_token, token_expiry, criado_em FROM usuarios WHERE id = $1', [id]);
    return rows[0] || null;
}

async function listar() {
    // Retorna todos os usuários
    const { rows } = await pool.query('SELECT id, nome, email, google_id, avatar_url, criado_em FROM usuarios');
    return rows;
}


// Remove funções de ativação/desativação pois não temos mais a coluna 'ativo'

// Funções de autenticação
async function buscarPorGoogleId(googleId) {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE google_id = $1', [googleId]);
    return rows[0];
}

async function criar(usuario) {
    const { nome, email, googleId, avatarUrl, googleAccessToken, googleRefreshToken, tokenExpiry } = usuario;
    const sql = 'INSERT INTO usuarios (nome, email, google_id, avatar_url, google_access_token, google_refresh_token, token_expiry) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const { rows } = await pool.query(sql, [nome, email, googleId, avatarUrl || null, googleAccessToken || null, googleRefreshToken || null, tokenExpiry || null]);
    return rows[0];
}

// Remove (hard) usuário — usado para operações administrativas
async function desativar(id) {
    if (!id) return false;
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    return result.rowCount > 0;
}

// Reativar não é suportado quando usamos delete; mantém para compatibilidade da API
async function reativar(id) {
    // Não há operação de reativação com exclusão física; retornar false para sinalizar não encontrado
    return false;
}

// Atualizar apenas o avatar_url do usuário
async function atualizarAvatar(id, avatarUrl) {
    if (!id) return false;
    const result = await pool.query('UPDATE usuarios SET avatar_url = $1 WHERE id = $2', [avatarUrl, id]);
    return result.rowCount > 0;
}

// Atualizar tokens do Google Calendar
async function atualizarTokensGoogle(id, accessToken, refreshToken, tokenExpiry) {
    if (!id) return false;
    const sql = 'UPDATE usuarios SET google_access_token = $1, google_refresh_token = COALESCE($2, google_refresh_token), token_expiry = $3 WHERE id = $4';
    const result = await pool.query(sql, [accessToken, refreshToken, tokenExpiry, id]);
    return result.rowCount > 0;
}

export {
    listar,
    buscarPorId,
    buscarPorGoogleId,
    criar,
    desativar,
    reativar,
    atualizarAvatar,
    atualizarTokensGoogle
};