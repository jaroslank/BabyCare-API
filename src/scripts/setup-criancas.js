import pool from '../config/database.js';

async function createCriancasTable() {
    try {
        console.log('Conectando ao banco...');
        const sql = `
            CREATE TABLE IF NOT EXISTS criancas (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
                nome VARCHAR(255) NOT NULL,
                data_nascimento DATE NOT NULL,
                avatar_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(sql);
        console.log('✅ Tabela "criancas" criada com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao criar tabela:', error.message);
    } finally {
        await pool.end();
    }
}

createCriancasTable();