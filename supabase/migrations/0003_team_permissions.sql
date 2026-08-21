-- Team & permissions: owner has full access always; members get a
-- per-module access level (none / view / manage) that the owner sets.
-- "manage" = view + create + update + delete. "view" = read-only.

-- ---------------------------------------------------------------------------
-- profiles.role: 'admin' (legacy) is treated the same as 'owner'. New rows
-- use 'owner' | 'member'.
-- ---------------------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('owner', 'member', 'admin'));
alter table public.profiles alter column role set default 'member';

-- Denormalized copy of auth.users.email, set once when a member is invited,
-- so the Team page can list members without needing admin API calls.
alter table public.profiles add column if not exists email text;
update public.profiles p set email = u.email
  from auth.users u where u.id = p.id and p.email is null;

-- Promote any existing legacy 'admin' rows to 'owner' (there should only be
-- the one you created manually before this migration).
update public.profiles set role = 'owner' where role = 'admin';

-- ---------------------------------------------------------------------------
-- permissions: one row per (member, module). Owners don't need rows here —
-- is_owner() always grants everything.
-- ---------------------------------------------------------------------------
create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  module text not null check (module in (
    'properties', 'projects', 'contacts', 'payments',
    'expenses', 'income', 'supplies', 'reports'
  )),
  access text not null default 'none' check (access in ('none', 'view', 'manage')),
  unique (profile_id, module)
);

create index permissions_profile_id_idx on public.permissions (profile_id);

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------
create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('owner', 'admin')
  );
$$;

create or replace function public.has_module_access(p_module text, p_min_level text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_owner()
    or exists (
      select 1 from public.permissions p
      where p.profile_id = auth.uid()
        and p.module = p_module
        and (
          p.access = 'manage'
          or (p.access = 'view' and p_min_level = 'view')
        )
    );
$$;

-- Replaces the old is_admin() — kept as an alias so nothing else breaks.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_owner();
$$;

-- Prevent a member from promoting themselves via their own profile update.
create or replace function public.prevent_role_self_promotion()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role and not public.is_owner() then
    raise exception 'Only the owner can change roles';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_role_change on public.profiles;
create trigger prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_self_promotion();

-- ---------------------------------------------------------------------------
-- profiles RLS: owner manages everyone; a member can read/update only
-- their own row (role changes are blocked by the trigger above).
-- ---------------------------------------------------------------------------
drop policy if exists "admin full access" on public.profiles;
create policy "owner full access to profiles" on public.profiles
  for all using (public.is_owner()) with check (public.is_owner());
create policy "member reads own profile" on public.profiles
  for select using (id = auth.uid());
create policy "member updates own profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- permissions RLS: owner manages all; a member can only read their own rows
-- (so the UI can hide sections they can't use).
-- ---------------------------------------------------------------------------
alter table public.permissions enable row level security;
create policy "owner full access to permissions" on public.permissions
  for all using (public.is_owner()) with check (public.is_owner());
create policy "member reads own permissions" on public.permissions
  for select using (profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Per-module RLS on data tables (replaces the old blanket "admin full access")
-- ---------------------------------------------------------------------------
drop policy if exists "admin full access" on public.properties;
create policy "view properties" on public.properties for select using (public.has_module_access('properties', 'view'));
create policy "insert properties" on public.properties for insert with check (public.has_module_access('properties', 'manage'));
create policy "update properties" on public.properties for update using (public.has_module_access('properties', 'manage')) with check (public.has_module_access('properties', 'manage'));
create policy "delete properties" on public.properties for delete using (public.has_module_access('properties', 'manage'));

drop policy if exists "admin full access" on public.projects;
create policy "view projects" on public.projects for select using (public.has_module_access('projects', 'view'));
create policy "insert projects" on public.projects for insert with check (public.has_module_access('projects', 'manage'));
create policy "update projects" on public.projects for update using (public.has_module_access('projects', 'manage')) with check (public.has_module_access('projects', 'manage'));
create policy "delete projects" on public.projects for delete using (public.has_module_access('projects', 'manage'));

drop policy if exists "admin full access" on public.project_phases;
create policy "view project_phases" on public.project_phases for select using (public.has_module_access('projects', 'view'));
create policy "insert project_phases" on public.project_phases for insert with check (public.has_module_access('projects', 'manage'));
create policy "update project_phases" on public.project_phases for update using (public.has_module_access('projects', 'manage')) with check (public.has_module_access('projects', 'manage'));
create policy "delete project_phases" on public.project_phases for delete using (public.has_module_access('projects', 'manage'));

drop policy if exists "admin full access" on public.contacts;
create policy "view contacts" on public.contacts for select using (public.has_module_access('contacts', 'view'));
create policy "insert contacts" on public.contacts for insert with check (public.has_module_access('contacts', 'manage'));
create policy "update contacts" on public.contacts for update using (public.has_module_access('contacts', 'manage')) with check (public.has_module_access('contacts', 'manage'));
create policy "delete contacts" on public.contacts for delete using (public.has_module_access('contacts', 'manage'));

drop policy if exists "admin full access" on public.payments;
create policy "view payments" on public.payments for select using (public.has_module_access('payments', 'view'));
create policy "insert payments" on public.payments for insert with check (public.has_module_access('payments', 'manage'));
create policy "update payments" on public.payments for update using (public.has_module_access('payments', 'manage')) with check (public.has_module_access('payments', 'manage'));
create policy "delete payments" on public.payments for delete using (public.has_module_access('payments', 'manage'));

drop policy if exists "admin full access" on public.payment_installments;
create policy "view payment_installments" on public.payment_installments for select using (public.has_module_access('payments', 'view'));
create policy "insert payment_installments" on public.payment_installments for insert with check (public.has_module_access('payments', 'manage'));
create policy "update payment_installments" on public.payment_installments for update using (public.has_module_access('payments', 'manage')) with check (public.has_module_access('payments', 'manage'));
create policy "delete payment_installments" on public.payment_installments for delete using (public.has_module_access('payments', 'manage'));

drop policy if exists "admin full access" on public.expenses;
create policy "view expenses" on public.expenses for select using (public.has_module_access('expenses', 'view'));
create policy "insert expenses" on public.expenses for insert with check (public.has_module_access('expenses', 'manage'));
create policy "update expenses" on public.expenses for update using (public.has_module_access('expenses', 'manage')) with check (public.has_module_access('expenses', 'manage'));
create policy "delete expenses" on public.expenses for delete using (public.has_module_access('expenses', 'manage'));

drop policy if exists "admin full access" on public.income;
create policy "view income" on public.income for select using (public.has_module_access('income', 'view'));
create policy "insert income" on public.income for insert with check (public.has_module_access('income', 'manage'));
create policy "update income" on public.income for update using (public.has_module_access('income', 'manage')) with check (public.has_module_access('income', 'manage'));
create policy "delete income" on public.income for delete using (public.has_module_access('income', 'manage'));

drop policy if exists "admin full access" on public.supply_quantities;
create policy "view supply_quantities" on public.supply_quantities for select using (public.has_module_access('supplies', 'view'));
create policy "insert supply_quantities" on public.supply_quantities for insert with check (public.has_module_access('supplies', 'manage'));
create policy "update supply_quantities" on public.supply_quantities for update using (public.has_module_access('supplies', 'manage')) with check (public.has_module_access('supplies', 'manage'));
create policy "delete supply_quantities" on public.supply_quantities for delete using (public.has_module_access('supplies', 'manage'));
