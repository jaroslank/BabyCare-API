-- 1. Create the ENUM type for meal types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_refeicao_enum') THEN
        CREATE TYPE tipo_refeicao_enum AS ENUM ('cafe_da_manha', 'almoco', 'jantar', 'lanche', 'mamadeira', 'outro');
    END IF;
END$$;

-- 2. Create the refeicoes table
CREATE TABLE IF NOT EXISTS refeicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crianca_id UUID NOT NULL REFERENCES criancas(id) ON DELETE CASCADE,
  tipo_refeicao tipo_refeicao_enum DEFAULT 'outro',
  descricao TEXT,
  horario TIME NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS ix_refeicoes_crianca ON refeicoes(crianca_id);
CREATE INDEX IF NOT EXISTS ix_refeicoes_data ON refeicoes(data);
