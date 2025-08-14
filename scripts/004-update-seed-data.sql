-- Insert your admin user
INSERT INTO users (id, name, email, password, role, created_at) VALUES
(
    gen_random_uuid(),
    'Gustavo Pizani',
    'pizani@realsales.com.br',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- RealSales2024!
    'admin',
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role;

-- Add some sample properties with enhanced data
INSERT INTO properties (id, title, description, address, city, state, zip_code, property_type, status, total_units, delivery_date, developer_name, partnership_manager, typologies, images, created_at) VALUES
(
    gen_random_uuid(),
    'Residencial Jardim das Flores',
    'Empreendimento residencial de alto padrão com área de lazer completa, localizado em região nobre da cidade.',
    'Rua das Flores, 123 - Jardim Botânico',
    'São Paulo',
    'SP',
    '01234-567',
    'residencial',
    'lancamento',
    120,
    '2025-12-31',
    'Construtora Jardim',
    'Maria Silva',
    '[
        {"id": "1", "name": "2 Quartos", "value": "R$ 450.000"},
        {"id": "2", "name": "3 Quartos", "value": "R$ 650.000"},
        {"id": "3", "name": "Cobertura", "value": "R$ 950.000"}
    ]'::jsonb,
    '[]'::jsonb,
    CURRENT_TIMESTAMP
),
(
    gen_random_uuid(),
    'Comercial Business Center',
    'Centro comercial moderno com salas corporativas e espaços de coworking.',
    'Av. Paulista, 1000 - Bela Vista',
    'São Paulo',
    'SP',
    '01310-100',
    'comercial',
    'construcao',
    80,
    '2024-08-30',
    'Construtora Moderna',
    'João Santos',
    '[
        {"id": "1", "name": "Sala 30m²", "value": "R$ 280.000"},
        {"id": "2", "name": "Sala 50m²", "value": "R$ 420.000"},
        {"id": "3", "name": "Loja Térrea", "value": "R$ 680.000"}
    ]'::jsonb,
    '[]'::jsonb,
    CURRENT_TIMESTAMP
),
(
    gen_random_uuid(),
    'Condomínio Vila Verde',
    'Casas em condomínio fechado com segurança 24h e área verde preservada.',
    'Estrada do Verde, 500 - Vila Madalena',
    'São Paulo',
    'SP',
    '05432-100',
    'residencial',
    'planejamento',
    45,
    '2026-06-30',
    'Construtora Verde',
    'Ana Costa',
    '[
        {"id": "1", "name": "Casa 2 Quartos", "value": "R$ 580.000"},
        {"id": "2", "name": "Casa 3 Quartos", "value": "R$ 750.000"}
    ]'::jsonb,
    '[]'::jsonb,
    CURRENT_TIMESTAMP
);

-- Add some sample clients with different pipeline statuses
INSERT INTO clients (id, name, email, phone, status, source, notes, created_at) VALUES
(
    gen_random_uuid(),
    'Carlos Mendes',
    'carlos.mendes@email.com',
    '(11) 99999-1111',
    'em_andamento',
    'site',
    'Interessado em apartamento 3 quartos no Jardim das Flores',
    CURRENT_TIMESTAMP
),
(
    gen_random_uuid(),
    'Fernanda Lima',
    'fernanda.lima@email.com',
    '(11) 99999-2222',
    'qualificado',
    'indicacao',
    'Cliente qualificado, orçamento até R$ 500.000',
    CURRENT_TIMESTAMP
),
(
    gen_random_uuid(),
    'Roberto Silva',
    'roberto.silva@email.com',
    '(11) 99999-3333',
    'proposta',
    'facebook',
    'Proposta enviada para cobertura no Jardim das Flores',
    CURRENT_TIMESTAMP
),
(
    gen_random_uuid(),
    'Mariana Santos',
    'mariana.santos@email.com',
    '(11) 99999-4444',
    'fechado',
    'google',
    'Venda fechada - Casa 3 quartos no Vila Verde',
    CURRENT_TIMESTAMP
);

-- Add some sample tasks
INSERT INTO tasks (id, title, description, due_date, status, assigned_to, client_id, created_at) VALUES
(
    gen_random_uuid(),
    'Ligar para Carlos Mendes',
    'Agendar visita ao empreendimento Jardim das Flores',
    CURRENT_DATE + INTERVAL '1 day',
    'pendente',
    (SELECT id FROM users WHERE email = 'pizani@realsales.com.br'),
    (SELECT id FROM clients WHERE email = 'carlos.mendes@email.com'),
    CURRENT_TIMESTAMP
),
(
    gen_random_uuid(),
    'Enviar proposta para Fernanda',
    'Elaborar proposta personalizada baseada no perfil da cliente',
    CURRENT_DATE + INTERVAL '2 days',
    'pendente',
    (SELECT id FROM users WHERE email = 'pizani@realsales.com.br'),
    (SELECT id FROM clients WHERE email = 'fernanda.lima@email.com'),
    CURRENT_TIMESTAMP
),
(
    gen_random_uuid(),
    'Follow-up Roberto Silva',
    'Verificar status da análise de crédito',
    CURRENT_DATE + INTERVAL '3 days',
    'pendente',
    (SELECT id FROM users WHERE email = 'pizani@realsales.com.br'),
    (SELECT id FROM clients WHERE email = 'roberto.silva@email.com'),
    CURRENT_TIMESTAMP
);
