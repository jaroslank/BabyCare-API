import pool from '../../config/database.js';

async function criar(crianca) {
    const { usuario_id, nome, data_nascimento, avatar_url } = crianca;
    const { rows } = await pool.query(
        'INSERT INTO criancas (usuario_id, nome, data_nascimento, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [usuario_id, nome, data_nascimento, avatar_url]
    );
    return rows[0];
}

async function listarPorUsuarioId(usuario_id) {
    const { rows } = await pool.query('SELECT * FROM criancas WHERE usuario_id = $1', [usuario_id]);
    return rows;
}

async function buscarPorId(id) {
    const { rows } = await pool.query('SELECT * FROM criancas WHERE id = $1', [id]);
    return rows[0] || null;
}

async function atualizar(id, crianca) {
    const { nome, data_nascimento, avatar_url } = crianca;
    const { rows } = await pool.query(
        'UPDATE criancas SET nome = $1, data_nascimento = $2, avatar_url = $3 WHERE id = $4 RETURNING *',
        [nome, data_nascimento, avatar_url, id]
    );
    return rows[0] || null;
}

async function removerPorId(id) {
    const { rows } = await pool.query('DELETE FROM criancas WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
}

export {
    criar,
    listarPorUsuarioId,
    buscarPorId,
    atualizar,
    removerPorId
};
