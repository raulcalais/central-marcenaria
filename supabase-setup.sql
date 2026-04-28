-- ═══════════════════════════════════════════════════════════════
-- CENTRAL MARCENARIA 4.0 — Setup do Banco de Dados (Supabase)
-- Execute este SQL no painel do Supabase: SQL Editor > New Query
-- ═══════════════════════════════════════════════════════════════

-- 1. Tabela de perfis (complementa o auth do Supabase)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client','admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de pedidos
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  display_id TEXT UNIQUE, -- CM-XXXXX
  client_id UUID REFERENCES profiles(id),
  client_name TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'aguardando' CHECK (status IN ('aguardando','analise','corte','filetamento','pronto','entregue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de arquivos do pedido
CREATE TABLE order_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  name TEXT,
  size TEXT,
  type TEXT,
  url TEXT,
  is_image BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de mensagens (chat)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  sender_name TEXT,
  sender_role TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- SEGURANÇA — Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles: usuário vê só o próprio perfil; admin vê todos
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "profiles_admin" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders: cliente vê seus pedidos; admin vê todos
CREATE POLICY "orders_client" ON orders FOR ALL USING (
  client_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order files: mesmo acesso dos pedidos
CREATE POLICY "files_access" ON order_files FOR ALL USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_files.order_id
    AND (orders.client_id = auth.uid() OR
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  )
);

-- Messages: mesmo acesso dos pedidos
CREATE POLICY "messages_access" ON messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = messages.order_id
    AND (orders.client_id = auth.uid() OR
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  )
);

-- ═══════════════════════════════════════════════════════════
-- TRIGGER: criar perfil automático ao registrar usuário
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, phone, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'phone', 'client')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════════
-- REALTIME: habilitar para chat ao vivo
-- ═══════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- ═══════════════════════════════════════════════════════════
-- ADMIN PADRÃO — Rode DEPOIS de criar sua conta no portal
-- Substitua 'SEU-UUID-AQUI' pelo seu UUID de usuário
-- (Supabase > Authentication > Users > copie o User UID)
-- ═══════════════════════════════════════════════════════════
-- UPDATE profiles SET role = 'admin', name = 'Carlos MShop' WHERE id = 'SEU-UUID-AQUI';
