# 🚀 Guia de Deploy - Real Sales CRM

## Pré-requisitos

- Conta no GitHub
- Conta na Vercel
- Banco de dados Neon (PostgreSQL)

## 1. Preparar Repositório GitHub

### 1.1 Criar Repositório
\`\`\`bash
# Inicializar Git
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "feat: sistema CRM completo com gestão de propriedades"

# Criar repositório no GitHub e adicionar remote
git remote add origin https://github.com/SEU_USUARIO/real-sales-crm.git

# Push para GitHub
git push -u origin main
\`\`\`

### 1.2 Resolver Problema do Sharp
Se aparecer o erro do sharp durante o build:

\`\`\`bash
# Instalar dependências
npm install

# Aprovar builds do sharp
npm run approve-builds
\`\`\`

## 2. Configurar Banco de Dados (Neon)

### 2.1 Criar Projeto no Neon
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma nova conta ou faça login
3. Clique em "Create Project"
4. Escolha região (preferencialmente São Paulo)
5. Copie a connection string

### 2.2 Executar Scripts SQL
Execute os scripts na seguinte ordem no console SQL do Neon:

1. **`scripts/001-create-database-schema.sql`**
   - Cria todas as tabelas básicas
   - Define relacionamentos e índices

2. **`scripts/002-seed-initial-data.sql`**
   - Insere dados iniciais de exemplo
   - Cria usuários de teste

3. **`scripts/003-add-property-changes-table.sql`**
   - Adiciona sistema de controle de alterações
   - Cria tabela de histórico

4. **`scripts/004-update-seed-data.sql`**
   - Insere seu usuário admin (Gustavo Pizani)
   - Adiciona dados de exemplo atualizados

## 3. Deploy na Vercel

### 3.1 Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Conecte sua conta GitHub
4. Selecione o repositório `real-sales-crm`
5. Clique em "Import"

### 3.2 Configurar Variáveis de Ambiente
Na seção "Environment Variables", adicione:

\`\`\`env
# Banco de Dados
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Autenticação
JWT_SECRET=b7bf7faa191b055bed080d8438a5e5e5
NEXTAUTH_URL=https://SEU_DOMINIO.vercel.app
NEXTAUTH_SECRET=minha-chave-nextauth-super-secreta-123

# Ambiente
NODE_ENV=production
\`\`\`

### 3.3 Configurações de Build
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 3.4 Deploy
1. Clique em "Deploy"
2. Aguarde o build completar (2-3 minutos)
3. Acesse o link gerado

## 4. Primeiro Acesso

### 4.1 Credenciais de Admin
- **Email:** `pizani@realsales.com.br`
- **Senha:** `RealSales2024!`

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

### 4.2 Verificar Funcionalidades
Teste as seguintes funcionalidades:

- ✅ Login com suas credenciais
- ✅ Dashboard com métricas
- ✅ Pipeline de vendas (drag & drop)
- ✅ Cadastro de novo imóvel
- ✅ Upload de imagens
- ✅ Auto-save
- ✅ Sistema de aprovação

## 5. Configurações Pós-Deploy

### 5.1 Domínio Personalizado (Opcional)
1. Na Vercel, vá em "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### 5.2 Monitoramento
1. Ative Vercel Analytics
2. Configure alertas de erro
3. Monitore performance

### 5.3 Backup
1. Configure backup automático do Neon
2. Exporte dados regularmente
3. Documente procedimentos

## 6. Solução de Problemas

### 6.1 Erro de Build
\`\`\`bash
# Limpar cache
npm run build

# Verificar dependências
npm audit fix
\`\`\`

### 6.2 Erro de Banco
- Verificar connection string
- Confirmar execução dos scripts SQL
- Testar conexão no Neon console

### 6.3 Erro de Autenticação
- Verificar variáveis de ambiente
- Confirmar NEXTAUTH_URL
- Testar credenciais

## 7. Próximos Passos

### 7.1 Configuração da Equipe
1. Adicionar usuários via interface
2. Definir permissões por cargo
3. Treinar equipe no sistema

### 7.2 Personalização
1. Alterar logo e cores
2. Configurar integrações
3. Ajustar fluxos de trabalho

### 7.3 Otimização
1. Monitorar performance
2. Otimizar queries
3. Implementar cache

## 8. Suporte

### 8.1 Documentação
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)

### 8.2 Logs e Debug
- Vercel Functions logs
- Browser DevTools
- Neon query logs

---

## ✅ Checklist de Deploy

- [ ] Repositório GitHub criado
- [ ] Scripts SQL executados
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy na Vercel realizado
- [ ] Primeiro login testado
- [ ] Funcionalidades principais testadas
- [ ] Equipe configurada
- [ ] Backup configurado

**🎉 Sistema pronto para uso em produção!**
\`\`\`

Agora vou atualizar o botão "Novo Imóvel" na página de listagem:

```tsx file="app/properties/page.tsx"
[v0-no-op-code-block-prefix]import Link from 'next/link';
import { Button } from 'ui';
import { Plus } from 'lucide-react';

export default function PropertiesPage() {
  return (
    <div>
      <Button asChild>
        <Link href="/properties/new">
          <Plus className="h-4 w-4 mr-2" />
          Novo Imóvel
        </Link>
      </Button>
      {/* rest of code here */}
    </div>
  );
}
