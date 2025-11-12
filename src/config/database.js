import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuração da conexão com o PostgreSQL usando um pool de conexões
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

// Tratamento de erros no pool para evitar crashes
pool.on('error', (err) => {
    console.error('Erro inesperado no pool do PostgreSQL:', err);
});

export default pool;
