create type public.debt_type as enum (
  'owed_to_me',
  'i_owe'
);

create table public.debts (
  id uuid not null primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.debt_type not null,
  counterpart_name text not null,
  amount bigint not null check (amount > 0),
  note text,
  due_date date,
  settled_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index debts_user_id_idx on public.debts (user_id);

create index debts_user_id_settled_at_idx on public.debts (user_id, settled_at);

alter table public.debts enable row level security;

create policy "Users can view their own debts"
  on public.debts
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own debts"
  on public.debts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own debts"
  on public.debts
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own debts"
  on public.debts
  for delete
  to authenticated
  using (auth.uid() = user_id);