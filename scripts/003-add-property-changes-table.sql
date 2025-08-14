-- Tabela para histórico de alterações em propriedades
CREATE TABLE IF NOT EXISTS property_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  field VARCHAR(100) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  change_type VARCHAR(20) DEFAULT 'update', -- 'create', 'update', 'delete'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_property_changes_property_id ON property_changes(property_id);
CREATE INDEX IF NOT EXISTS idx_property_changes_user_id ON property_changes(user_id);
CREATE INDEX IF NOT EXISTS idx_property_changes_status ON property_changes(status);
CREATE INDEX IF NOT EXISTS idx_property_changes_created_at ON property_changes(created_at DESC);

-- Atualizar tabela de propriedades para suportar múltiplas tipologias
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS typologies JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS developer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS partnership_manager VARCHAR(255),
ADD COLUMN IF NOT EXISTS developer_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS developer_email VARCHAR(255);

-- Migrar dados existentes de owner para developer (se existir tabela property_owners)
-- UPDATE properties SET 
--   developer_name = (SELECT name FROM property_owners WHERE property_id = properties.id LIMIT 1),
--   developer_phone = (SELECT phone FROM property_owners WHERE property_id = properties.id LIMIT 1),
--   developer_email = (SELECT email FROM property_owners WHERE property_id = properties.id LIMIT 1);
