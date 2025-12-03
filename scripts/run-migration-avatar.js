import pool from '../src/config/database.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    try {
        console.log('🔄 Executando migration 002_add_avatar_url_to_usuarios...');
        
        // Ler o SQL da migration
        const sqlPath = path.join(__dirname, '..', 'migrations', '002_add_avatar_url_to_usuarios.sql');
        const sqlContent = await fs.readFile(sqlPath, 'utf8');
        
        // Executar a migration
        await pool.query(sqlContent);
        console.log('✅ Coluna avatar_url adicionada com sucesso!');
        
        // Verificar se a coluna foi criada
        const result = await pool.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'usuarios'
            AND column_name = 'avatar_url';
        `);
        
        if (result.rows.length > 0) {
            console.log('\n✓ Estrutura da nova coluna:');
            console.log(`- ${result.rows[0].column_name}: ${result.rows[0].data_type}(${result.rows[0].character_maximum_length})`);
        }

    } catch (error) {
        console.error('\n❌ Erro durante a migration:');
        console.error(error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigration();
