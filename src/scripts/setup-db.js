import pool from '../config/database.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    try {
        // 1. Teste de conexão
        console.log('Testando conexão com o banco...');
        await pool.query('SELECT NOW()');
        console.log('✓ Conexão bem sucedida!');

        // 2. Ler o SQL
        const sqlPath = path.join(__dirname, '..', 'config', 'sql', 'create_usuario_postgres.sql');
        const sqlContent = await fs.readFile(sqlPath, 'utf8');
        
        // 3. Criar a tabela
        console.log('\nCriando tabela usuario...');
        await pool.query(sqlContent);
        
        // 4. Verificar se a tabela foi criada
        const result = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_name = 'usuario'
            );
        `);
        
        if (result.rows[0].exists) {
            console.log('✓ Tabela usuario criada com sucesso!');
            
            // Mostrar estrutura da tabela
            const columns = await pool.query(`
                SELECT column_name, data_type, column_default, is_nullable
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = 'usuario'
                ORDER BY ordinal_position;
            `);
            
            console.log('\nEstrutura da tabela:');
            columns.rows.forEach(col => {
                console.log(`- ${col.column_name}: ${col.data_type}${col.column_default ? ' (default: ' + col.column_default + ')' : ''}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
            });
        } else {
            throw new Error('Falha ao criar a tabela usuario');
        }

    } catch (error) {
        console.error('\n❌ Erro durante setup do banco:');
        console.error(error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Executar setup
setupDatabase();