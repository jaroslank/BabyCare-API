-- Migration: Criar tabela remedios
-- Data: 2025-12-03
-- Descrição: Tabela para armazenar remédios associados a crianças

CREATE TABLE IF NOT EXISTS public.remedios (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  crianca_id UUID NOT NULL,
  nome VARCHAR(100) NOT NULL,
  horario TIME WITHOUT TIME ZONE NOT NULL,
  dosagem VARCHAR(50),
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT remedios_pkey PRIMARY KEY (id),
  CONSTRAINT remedios_crianca_id_fkey FOREIGN KEY (crianca_id) REFERENCES criancas(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_remedios_crianca ON public.remedios USING btree (crianca_id);
CREATE INDEX IF NOT EXISTS ix_remedios_horario ON public.remedios USING btree (horario);

COMMENT ON TABLE public.remedios IS 'Remédios diários associados a crianças';
COMMENT ON COLUMN public.remedios.ativo IS 'Indica se o remédio ainda está sendo administrado';
