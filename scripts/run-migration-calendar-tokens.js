import pool from '../src/config/database.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    try {
        console.log('🔄 Executando migration 003_add_google_calendar_tokens...');
        
        const sqlPath = path.join(__dirname, '..', 'migrations', '003_add_google_calendar_tokens.sql');
        const sqlContent = await fs.readFile(sqlPath, 'utf8');
        
        await pool.query(sqlContent);
        console.log('✅ Colunas de tokens do Google Calendar adicionadas com sucesso!');
        
        const result = await pool.query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'usuarios'
            AND column_name IN ('google_access_token', 'google_refresh_token', 'token_expiry')
            ORDER BY column_name;
        `);
        
        if (result.rows.length > 0) {
            console.log('\n✓ Estrutura das novas colunas:');
            result.rows.forEach(col => {
                console.log(`- ${col.column_name}: ${col.data_type}`);
            });
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
