-- Create property_changes table for tracking modifications
CREATE TABLE IF NOT EXISTS property_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    field VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_changes_property_id ON property_changes(property_id);
CREATE INDEX IF NOT EXISTS idx_property_changes_user_id ON property_changes(user_id);
CREATE INDEX IF NOT EXISTS idx_property_changes_status ON property_changes(status);
CREATE INDEX IF NOT EXISTS idx_property_changes_created_at ON property_changes(created_at);

-- Add new columns to properties table for enhanced functionality
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS typologies JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS developer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS partnership_manager VARCHAR(255),
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';

-- Update existing properties to have empty arrays for new JSONB fields
UPDATE properties 
SET 
    typologies = '[]'::jsonb,
    images = '[]'::jsonb
WHERE 
    typologies IS NULL 
    OR images IS NULL;
