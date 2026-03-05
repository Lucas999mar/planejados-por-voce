-- Planejados Por Você - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT,
  whatsapp TEXT,
  email TEXT,
  cidade TEXT,
  bairro TEXT,
  tipo_servico TEXT CHECK (tipo_servico IN ('planejados', 'assistencia')),
  ambiente TEXT,
  orcamento_faixa TEXT,
  urgencia TEXT,
  descricao TEXT,
  consentimento_lgpd BOOLEAN DEFAULT FALSE,
  origem_utm JSONB,
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'em_atendimento', 'orcamento_enviado', 'fechado', 'perdido', 'followup')),
  tags TEXT[] DEFAULT '{}',
  notas_admin TEXT,
  dispositivo TEXT,
  pagina_origem TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  channel TEXT DEFAULT 'site_chat',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender TEXT CHECK (sender IN ('user', 'ai')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_tipo_servico ON leads(tipo_servico);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_cidade ON leads(cidade);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Auto-update updated_at on leads
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for API routes)
CREATE POLICY "Service role full access on leads" ON leads
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on conversations" ON conversations
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on messages" ON messages
  FOR ALL USING (auth.role() = 'service_role');

-- Allow anon users to insert leads (for public forms)
CREATE POLICY "Anon can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon can insert conversations" ON conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view','click','scroll','form_start','form_submit','whatsapp_click')),
  page_url TEXT DEFAULT '/',
  element_id TEXT,
  element_text TEXT,
  metadata JSONB,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_visitor ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_page ON analytics_events(page_url);

-- RLS for analytics
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on analytics" ON analytics_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anon can insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);
