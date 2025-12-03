import pool from '../src/config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    const client = await pool.connect();
    
    try {
        console.log('🔄 Iniciando migrations...\n');

        // Migration 004: remedios
        const migration004 = fs.readFileSync(path.join(__dirname, '004_create_remedios.sql'), 'utf-8');
        console.log('▶️  Executando migration 004 (remedios)...');
        await client.query(migration004);
        console.log('✅ Migration 004 concluída com sucesso!\n');

        // Migration 005: telefones_emergencia
        const migration005 = fs.readFileSync(path.join(__dirname, '005_create_telefones_emergencia.sql'), 'utf-8');
        console.log('▶️  Executando migration 005 (telefones_emergencia)...');
        await client.query(migration005);
        console.log('✅ Migration 005 concluída com sucesso!\n');

        console.log('🎉 Todas as migrations foram executadas com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao executar migrations:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations();
