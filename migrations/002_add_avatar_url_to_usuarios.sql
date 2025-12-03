-- Migration: Adicionar coluna avatar_url à tabela usuarios
-- Data: 2025-12-03
-- Descrição: Armazena a URL da foto do perfil do Google

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);

-- Comentário explicativo
COMMENT ON COLUMN usuarios.avatar_url IS 'URL da foto do perfil do Google (ex: https://lh3.googleusercontent.com/...)';
