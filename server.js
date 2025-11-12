import './src/config/passport-setup.js';
import dotenv from 'dotenv';
import pool from './src/config/database.js';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Função para iniciar o servidor após verificar a conexão com o banco
async function startServer() {
    try {
        await pool.query('SELECT 1');
        console.log('Conexão com o banco de dados PostgreSQL bem-sucedida.');

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Acesse http://localhost:${PORT} para testar sua conexão`);
        });
    } catch (error) {
        console.error('####################################################');
        console.error('ERRO: Não foi possível conectar ao banco de dados PostgreSQL.');
        console.error('Verifique se o serviço PostgreSQL está em execução e se as');
        console.error('credenciais em .env estão corretas.');
        console.error('Detalhes do erro:', error.message);
        console.error('####################################################');
        process.exit(1);
    }
}

startServer();