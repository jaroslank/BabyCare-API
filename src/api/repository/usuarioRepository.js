import pool from '../../config/database.js';

// Helper para reutilizar a busca
async function buscarPorId(id) {
    if (!id) return null;
    // Seleciona todas as colunas da tabela (aceita UUIDs ou strings)
    const { rows } = await pool.query('SELECT id, nome, email, google_id, criado_em FROM usuarios WHERE id = $1', [id]);
    return rows[0] || null;
}

async function listar() {
    // Retorna todos os usuários
    const { rows } = await pool.query('SELECT id, nome, email, google_id, criado_em FROM usuarios');
    return rows;
}


// Remove funções de ativação/desativação pois não temos mais a coluna 'ativo'

// Funções de autenticação
async function buscarPorGoogleId(googleId) {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE google_id = $1', [googleId]);
    return rows[0];
}

async function criar(usuario) {
    const { nome, email, googleId } = usuario;
    const sql = 'INSERT INTO usuarios (nome, email, google_id) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(sql, [nome, email, googleId]);
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

export {
    listar,
    buscarPorId,
    buscarPorGoogleId,
    criar,
    desativar,
    reativar
};