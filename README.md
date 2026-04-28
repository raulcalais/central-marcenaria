# Central Marcenaria 4.0 — Portal de Serviços

## 🚀 Como colocar no ar (passo a passo)

---

### ETAPA 1 — Criar conta no Supabase (banco de dados)

1. Acesse https://supabase.com e crie uma conta gratuita
2. Clique em **"New Project"**
3. Nome: `central-marcenaria`
4. Anote a senha do banco (guarde em local seguro)
5. Região: **South America (São Paulo)**
6. Aguarde ~2 minutos para criar

---

### ETAPA 2 — Configurar o banco de dados

1. No painel do Supabase, clique em **"SQL Editor"** no menu lateral
2. Clique em **"New Query"**
3. Copie TODO o conteúdo do arquivo `supabase-setup.sql`
4. Cole no editor e clique **"Run"**
5. Deve aparecer "Success"

---

### ETAPA 3 — Configurar Storage (arquivos)

1. No Supabase, clique em **"Storage"** no menu
2. Clique em **"New Bucket"**
3. Nome: `order-files`
4. Marque **"Public bucket"** ✓
5. Clique em **"Create bucket"**

---

### ETAPA 4 — Pegar as chaves da API

1. No Supabase, vá em **"Settings" → "API"**
2. Copie:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon / public key** (chave longa começando com `eyJ...`)

---

### ETAPA 5 — Configurar o projeto

1. Na pasta do projeto, copie o arquivo de exemplo:
   ```
   cp .env.example .env
   ```
2. Abra o arquivo `.env` e preencha:
   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```

---

### ETAPA 6 — Instalar e testar localmente (opcional)

Precisa ter Node.js instalado (https://nodejs.org)

```bash
npm install
npm run dev
```
Abra http://localhost:5173

---

### ETAPA 7 — Criar conta de admin

1. Acesse o portal e **crie uma conta** com seu e-mail
2. No Supabase, vá em **Authentication → Users**
3. Copie o **User UID** do seu usuário
4. Vá em **SQL Editor** e rode:
   ```sql
   UPDATE profiles SET role = 'admin', name = 'Carlos MShop'
   WHERE id = 'SEU-UUID-AQUI';
   ```

---

### ETAPA 8 — Deploy no Vercel (colocar na internet)

1. Crie uma conta em https://vercel.com (é gratuito)
2. Instale o Vercel CLI ou use o site:
   - Site: https://vercel.com/new
   - Faça upload da pasta do projeto
   - OU conecte ao GitHub (recomendado)

3. **Adicionar variáveis de ambiente no Vercel:**
   - Vá em **Settings → Environment Variables**
   - Adicione:
     - `VITE_SUPABASE_URL` = sua URL
     - `VITE_SUPABASE_ANON_KEY` = sua chave

4. Clique em **Deploy**

5. Seu site ficará em algo como:
   `https://central-marcenaria.vercel.app`

---

### ETAPA 9 — Domínio próprio (centralmarcenaria.com.br)

1. No Vercel, vá em **Settings → Domains**
2. Adicione: `centralmarcenaria.com.br`
3. No **registro.br**, adicione os registros DNS:
   ```
   Tipo: CNAME
   Nome: www
   Valor: cname.vercel-dns.com
   
   Tipo: A
   Nome: @
   Valor: 76.76.21.21
   ```
4. Aguarde até 24h para propagar

---

## ✅ Pronto!

Seu portal estará acessível em:
- **centralmarcenaria.com.br** (domínio próprio)
- Com login real, pedidos salvos no banco, upload de arquivos e chat em tempo real

---

## 📞 Suporte

Instagram: @marceneiroshop
Endereço: Av. Acesita, nº 1.080, Olaria - Timóteo/MG
