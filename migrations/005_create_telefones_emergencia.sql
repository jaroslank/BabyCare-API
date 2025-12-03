-- Migration: Criar tabela telefones_emergencia
-- Data: 2025-12-03
-- Descrição: Tabela para armazenar telefones de emergência por usuário

CREATE TABLE IF NOT EXISTS telefones_emergencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome_contato VARCHAR(100) NOT NULL,
  telefone VARCHAR(25) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_tel_usuario ON telefones_emergencia(usuario_id);

COMMENT ON TABLE telefones_emergencia IS 'Telefones de emergência cadastrados por usuário';
