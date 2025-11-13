-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- Policies for profiles
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create discussions table (starting numbers)
create table if not exists public.discussions (
  id uuid primary key default gen_random_uuid(),
  starting_number numeric not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now()
);

alter table public.discussions enable row level security;

-- Policies for discussions
create policy "discussions_select_all"
  on public.discussions for select
  using (true);

create policy "discussions_insert_authenticated"
  on public.discussions for insert
  with check (auth.uid() = author_id);

create policy "discussions_delete_own"
  on public.discussions for delete
  using (auth.uid() = author_id);

-- Create operations table (responses/comments)
create table if not exists public.operations (
  id uuid primary key default gen_random_uuid(),
  discussion_id uuid references public.discussions(id) on delete cascade not null,
  parent_id uuid references public.operations(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete cascade not null,
  operation_type text not null check (operation_type in ('add', 'subtract', 'multiply', 'divide')),
  right_operand numeric not null,
  result numeric not null,
  created_at timestamp with time zone default now()
);

alter table public.operations enable row level security;

-- Policies for operations
create policy "operations_select_all"
  on public.operations for select
  using (true);

create policy "operations_insert_authenticated"
  on public.operations for insert
  with check (auth.uid() = author_id);

create policy "operations_delete_own"
  on public.operations for delete
  using (auth.uid() = author_id);

-- Create trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
