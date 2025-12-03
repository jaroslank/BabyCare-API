-- Migration: Adicionar tokens do Google Calendar à tabela usuarios
-- Data: 2025-12-03
-- Descrição: Armazena access_token e refresh_token para integração com Google Calendar API

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS google_access_token TEXT,
ADD COLUMN IF NOT EXISTS google_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS token_expiry TIMESTAMPTZ;

-- Comentários explicativos
COMMENT ON COLUMN usuarios.google_access_token IS 'Token de acesso temporário do Google OAuth2 para acessar Google Calendar';
COMMENT ON COLUMN usuarios.google_refresh_token IS 'Token de refresh do Google OAuth2 para renovar access_token';
COMMENT ON COLUMN usuarios.token_expiry IS 'Data/hora de expiração do access_token';
