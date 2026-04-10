-- The Page Gallery: Founding Members Table
-- Migration: 20260410_founding_members.sql
-- Creates table to track founding member pledges

-- ─── Create founding_members table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.founding_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('seed', 'sprout', 'bloom', 'patron')),
  pledge_amount NUMERIC(10,2) NOT NULL CHECK (pledge_amount > 0),
  display_name TEXT,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pledged' CHECK (status IN ('pledged', 'confirmed', 'processed', 'cancelled')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one pledge per user
  CONSTRAINT unique_user_pledge UNIQUE (user_id)
);

-- ─── Create indexes ────────────────────────────────────────────────────────
CREATE INDEX idx_founding_members_user_id ON public.founding_members(user_id);
CREATE INDEX idx_founding_members_status ON public.founding_members(status);
CREATE INDEX idx_founding_members_tier ON public.founding_members(tier);
CREATE INDEX idx_founding_members_created_at ON public.founding_members(created_at DESC);

-- ─── Row Level Security (RLS) ──────────────────────────────────────────────
ALTER TABLE public.founding_members ENABLE ROW LEVEL SECURITY;

-- Users can view their own pledge
CREATE POLICY "Users can view own founding member pledge"
  ON public.founding_members
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own pledge
CREATE POLICY "Users can create own founding member pledge"
  ON public.founding_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pledge (only if status is 'pledged')
CREATE POLICY "Users can update own pledge if still pending"
  ON public.founding_members
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pledged')
  WITH CHECK (auth.uid() = user_id AND status = 'pledged');

-- Users can delete their own pledge (only if status is 'pledged')
CREATE POLICY "Users can delete own pledge if still pending"
  ON public.founding_members
  FOR DELETE
  USING (auth.uid() = user_id AND status = 'pledged');

-- Public can view non-anonymous confirmed pledges (for Founders' Garden page)
CREATE POLICY "Public can view non-anonymous confirmed pledges"
  ON public.founding_members
  FOR SELECT
  USING (status = 'confirmed' AND is_anonymous = FALSE);

-- ─── Comments ──────────────────────────────────────────────────────────────
COMMENT ON TABLE public.founding_members IS 'Tracks founding member pledges and investments for The Page Gallery';
COMMENT ON COLUMN public.founding_members.tier IS 'Founding member tier: seed (£25+), sprout (£75+), bloom (£150+), patron (£500+)';
COMMENT ON COLUMN public.founding_members.status IS 'Pledge status: pledged (intent recorded), confirmed (payment collected), processed (perks granted), cancelled';
COMMENT ON COLUMN public.founding_members.is_anonymous IS 'If true, do not display name in public Founders Garden';

-- ─── Grant permissions ─────────────────────────────────────────────────────
-- Allow authenticated users to interact with the table via RLS policies
GRANT SELECT, INSERT, UPDATE, DELETE ON public.founding_members TO authenticated;
GRANT SELECT ON public.founding_members TO anon; -- For public Founders' Garden view
