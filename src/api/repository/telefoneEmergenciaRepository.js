import pool from '../../config/database.js';

// Criar telefone de emergência
async function criar(telefone) {
    const { usuario_id, nome_contato, telefone: numero } = telefone;
    const sql = `
        INSERT INTO telefones_emergencia (usuario_id, nome_contato, telefone)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const { rows } = await pool.query(sql, [usuario_id, nome_contato, numero]);
    return rows[0];
}

// Listar telefones por usuário
async function listarPorUsuarioId(usuario_id) {
    const sql = `
        SELECT * FROM telefones_emergencia
        WHERE usuario_id = $1
        ORDER BY criado_em DESC
    `;
    const { rows } = await pool.query(sql, [usuario_id]);
    return rows;
}

// Buscar telefone por ID
async function buscarPorId(id) {
    const { rows } = await pool.query('SELECT * FROM telefones_emergencia WHERE id = $1', [id]);
    return rows[0] || null;
}

// Atualizar telefone
async function atualizar(id, dados) {
    const { nome_contato, telefone } = dados;
    const sql = `
        UPDATE telefones_emergencia 
        SET nome_contato = $1, telefone = $2
        WHERE id = $3
        RETURNING *
    `;
    const { rows } = await pool.query(sql, [nome_contato, telefone, id]);
    return rows[0] || null;
}

// Remover telefone
async function remover(id) {
    const result = await pool.query('DELETE FROM telefones_emergencia WHERE id = $1', [id]);
    return result.rowCount > 0;
}

export {
    criar,
    listarPorUsuarioId,
    buscarPorId,
    atualizar,
    remover
};
