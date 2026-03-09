-- Run this in Supabase Dashboard → SQL Editor (project lives on D:)
-- Expressions: one per wearer/design; supports one "live" later
create table if not exists expressions (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My Expression',
  mood text not null default 'calm',
  trigger_image text default '/markers/hiro.png',
  overlay_image text default '/overlays/tree-birds.svg',
  caption text,
  is_live boolean default true,
  created_at timestamptz default now()
);

-- Reactions: like, greeting, love, good, keep, etc. (counts + optional comment)
create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  expression_id uuid references expressions(id) on delete cascade not null,
  kind text not null check (kind in ('like', 'greeting', 'love', 'good', 'keep', 'comment')),
  author text default 'Viewer',
  text text,
  created_at timestamptz default now()
);

create index if not exists reactions_expression_id on reactions(expression_id);

-- Allow anonymous read/write for MVP (restrict later with RLS)
alter table expressions enable row level security;
alter table reactions enable row level security;

create policy "Allow all on expressions for MVP" on expressions for all using (true) with check (true);
create policy "Allow all on reactions for MVP" on reactions for all using (true) with check (true);
