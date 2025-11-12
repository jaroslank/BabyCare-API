const pool = require('../../config/database');

const create = async (localizacao) => {
    const { crianca_id, endereco, latitude, longitude } = localizacao;
    const result = await pool.query(
        'INSERT INTO localizacao (crianca_id, endereco, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *',
        [crianca_id, endereco, latitude, longitude]
    );
    return result.rows[0];
};

const findLatestByCriancaId = async (crianca_id) => {
    const result = await pool.query(
        'SELECT * FROM localizacao WHERE crianca_id = $1 ORDER BY data_hora DESC LIMIT 1',
        [crianca_id]
    );
    return result.rows[0];
};

const findAllByCriancaId = async (crianca_id) => {
    const result = await pool.query('SELECT * FROM localizacao WHERE crianca_id = $1 ORDER BY data_hora DESC', [crianca_id]);
    return result.rows;
};


const findById = async (id) => {
    const result = await pool.query('SELECT * FROM localizacao WHERE id = $1', [id]);
    return result.rows[0];
};

// Note: Update and Delete are less common for location tracking, but included for completeness.
const deleteById = async (id) => {
    const result = await pool.query('DELETE FROM localizacao WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    create,
    findLatestByCriancaId,
    findAllByCriancaId,
    findById,
    deleteById,
};
