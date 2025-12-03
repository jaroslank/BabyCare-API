import pool from '../../config/database.js';

// Criar novo remédio
async function criar(remedio) {
    const { crianca_id, nome, horario, dosagem, observacoes, ativo } = remedio;
    const sql = `
        INSERT INTO remedios (crianca_id, nome, horario, dosagem, observacoes, ativo)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const { rows } = await pool.query(sql, [crianca_id, nome, horario, dosagem || null, observacoes || null, ativo !== undefined ? ativo : true]);
    return rows[0];
}

// Listar remédios por usuário (via JOIN com criancas)
async function listarPorUsuarioId(usuario_id) {
    const sql = `
        SELECT r.* 
        FROM remedios r
        JOIN criancas c ON r.crianca_id = c.id
        WHERE c.usuario_id = $1
        ORDER BY r.horario ASC
    `;
    const { rows } = await pool.query(sql, [usuario_id]);
    return rows;
}

// Buscar remédio por ID
async function buscarPorId(id) {
    const { rows } = await pool.query('SELECT * FROM remedios WHERE id = $1', [id]);
    return rows[0] || null;
}

// Atualizar remédio
async function atualizar(id, dados) {
    const { nome, horario, dosagem, observacoes, ativo } = dados;
    const sql = `
        UPDATE remedios 
        SET nome = $1, horario = $2, dosagem = $3, observacoes = $4, ativo = $5
        WHERE id = $6
        RETURNING *
    `;
    const { rows } = await pool.query(sql, [nome, horario, dosagem, observacoes, ativo, id]);
    return rows[0] || null;
}

// Remover remédio
async function remover(id) {
    const result = await pool.query('DELETE FROM remedios WHERE id = $1', [id]);
    return result.rowCount > 0;
}

export {
    criar,
    listarPorUsuarioId,
    buscarPorId,
    atualizar,
    remover
};
