import pool from '../../config/database.js';

async function criar(refeicao) {
    const { crianca_id, tipo_refeicao, descricao, horario, data } = refeicao;
    const { rows } = await pool.query(
        `INSERT INTO refeicoes (crianca_id, tipo_refeicao, descricao, horario, data)
         VALUES ($1, $2, $3, $4, COALESCE($5::date, CURRENT_DATE))
         RETURNING *`,
        [crianca_id, tipo_refeicao || 'outro', descricao, horario, data]
    );
    return rows[0];
}

async function listarPorUsuarioId(usuario_id) {
    const { rows } = await pool.query(
        `SELECT r.* FROM refeicoes r
         JOIN criancas c ON r.crianca_id = c.id
         WHERE c.usuario_id = $1
         ORDER BY r.data ASC, r.horario ASC`,
        [usuario_id]
    );
    return rows;
}

async function buscarPorId(id) {
    const { rows } = await pool.query('SELECT * FROM refeicoes WHERE id = $1', [id]);
    return rows[0] || null;
}

async function atualizar(id, refeicao) {
    const { crianca_id, tipo_refeicao, descricao, horario, data } = refeicao;
    const { rows } = await pool.query(
        `UPDATE refeicoes SET crianca_id = $1, tipo_refeicao = $2,
             descricao = $3, horario = $4, data = $5
         WHERE id = $6 RETURNING *`,
        [crianca_id, tipo_refeicao, descricao, horario, data, id]
    );
    return rows[0] || null;
}

async function removerPorId(id) {
    const { rows } = await pool.query('DELETE FROM refeicoes WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
}

export {
    criar,
    listarPorUsuarioId,
    buscarPorId,
    atualizar,
    removerPorId
};
