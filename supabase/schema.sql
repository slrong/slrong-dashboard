-- Supabase SQL Editor에서 그대로 실행하세요.

create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  is_done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists memos (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null default '',
  category text not null default '일반',
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists calendar_events (
  uid text primary key,
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  location text,
  synced_at timestamptz not null default now()
);

-- RLS 활성화 (정책을 만들지 않아 기본적으로 전체 차단됨).
-- 서버는 service_role 키로 접속하므로 RLS를 우회해 정상 동작한다.
alter table todos enable row level security;
alter table memos enable row level security;
alter table posts enable row level security;
alter table calendar_events enable row level security;

-- Storage: 게시판 이미지를 위한 private 버킷
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', false)
on conflict (id) do nothing;
