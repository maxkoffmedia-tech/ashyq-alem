-- src/lib/db/schema.sql
-- Users and profiles
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  phone text,
  created_at timestamptz default now(),
  role text default 'user',
  is_anonymous boolean default false
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Rooms (chat / костер)
create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text,
  description text,
  is_public boolean default true,
  created_by uuid references users(id),
  created_at timestamptz default now()
);

-- Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references users(id),
  content text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Progress / 12 steps achievements
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  step_key text,
  value jsonb,
  completed boolean default false,
  updated_at timestamptz default now()
);

-- Indexes to speed up queries
create index if not exists idx_messages_room_created on messages(room_id, created_at desc);
create index if not exists idx_profiles_user on profiles(user_id);
