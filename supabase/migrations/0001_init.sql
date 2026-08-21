-- Renovation CRM — initial schema
-- All CRM/financial tables are admin-only via RLS (no anon access).
-- Public marketing site reads only through the `public_projects` view,
-- which exposes a safe column subset for projects flagged show_on_website = true.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: whitelist of admin users (1-2 people). Row must be inserted
-- manually after creating the auth user (Supabase dashboard -> Authentication),
-- e.g. insert into public.profiles (id, full_name) values ('<auth-user-uuid>', 'Owner');
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- properties (ακίνητα)
-- ---------------------------------------------------------------------------
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  power_supply_number text,
  water_supply_number text,
  sqm numeric,
  map_url text,
  acquisition_type text not null default 'flip'
    check (acquisition_type in ('flip', 'client_owned')),
  notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- projects (also doubles as the public portfolio source via the view below)
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  title text not null,
  scope_description text,
  project_type text not null default 'flip'
    check (project_type in ('flip', 'client_owned')),
  scope_size text not null default 'full'
    check (scope_size in ('full', 'partial')),
  budget numeric not null default 0,
  start_date date,
  end_date_planned date,
  end_date_actual date,
  status text not null default 'planning'
    check (status in ('planning', 'in_progress', 'completed')),
  show_on_website boolean not null default false,
  public_summary text,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create index projects_property_id_idx on public.projects (property_id);

-- ---------------------------------------------------------------------------
-- project_phases (timeline ανά φάση: 1=προκαταβολή, 2=δάπεδα/παραγγελίες, 3=κουφώματα/εξοφλήσεις/βαψίματα)
-- ---------------------------------------------------------------------------
create table public.project_phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  phase_number smallint not null check (phase_number between 1 and 3),
  name text not null,
  planned_start date,
  planned_end date,
  actual_start date,
  actual_end date,
  notes text,
  unique (project_id, phase_number)
);

create index project_phases_project_id_idx on public.project_phases (project_id);

-- ---------------------------------------------------------------------------
-- contacts (μάστορες / προμηθευτές / καθαρισμός / λοιποί συνεργάτες)
-- ---------------------------------------------------------------------------
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in (
    'υδραυλικός', 'ηλεκτρολόγος', 'γκρεμίσματα', 'κουφώματα', 'πλακάκια',
    'προμηθευτής', 'είδη_υγιεινής', 'γυψοσανίδας', 'μπετατζής', 'κουζίνα',
    'βαψίματα', 'καθαρισμός', 'μεσίτης', 'λογιστής', 'άλλο'
  )),
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- payments (πληρωμές σε μάστορες/προμηθευτές/καθαρισμό) + installments
-- payment_type είναι ελεύθερη επιλογή ανά πληρωμή, όχι ιδιότητα του contact.
-- ---------------------------------------------------------------------------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  category text not null,
  total_amount numeric not null default 0,
  payment_type text not null default 'lump_sum'
    check (payment_type in ('lump_sum', 'installments')),
  date_agreed date,
  status text not null default 'pending'
    check (status in ('pending', 'partial', 'paid')),
  notes text,
  created_at timestamptz not null default now()
);

create index payments_project_id_idx on public.payments (project_id);
create index payments_contact_id_idx on public.payments (contact_id);

create table public.payment_installments (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments (id) on delete cascade,
  installment_number smallint not null,
  amount numeric not null,
  due_date date,
  paid_date date,
  status text not null default 'pending'
    check (status in ('pending', 'paid')),
  unique (payment_id, installment_number)
);

create index payment_installments_payment_id_idx on public.payment_installments (payment_id);

-- ---------------------------------------------------------------------------
-- expenses (έξοδα — project_id null = εταιρικό/παγία, όχι ανά project)
-- ---------------------------------------------------------------------------
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  category text not null check (category in (
    'ενοίκιο_γραφείου', 'ασφάλεια', 'λογιστής', 'μεσιτικά', 'υλικά', 'άλλο'
  )),
  amount numeric not null,
  date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create index expenses_project_id_idx on public.expenses (project_id);

-- ---------------------------------------------------------------------------
-- income (έσοδα)
-- ---------------------------------------------------------------------------
create table public.income (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  category text not null check (category in (
    'πώληση_ακινήτου', 'ανακαίνιση', 'έκδοση_σύνδεση_λογαριασμών', 'ενοίκιο', 'άλλο'
  )),
  amount numeric not null,
  date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create index income_project_id_idx on public.income (project_id);

-- ---------------------------------------------------------------------------
-- supply_quantities (ποσότητες προμηθειών)
-- ---------------------------------------------------------------------------
create table public.supply_quantities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  item_name text not null,
  quantity numeric not null,
  unit text not null default 'τεμ',
  unit_cost numeric,
  total_cost numeric,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create index supply_quantities_project_id_idx on public.supply_quantities (project_id);

-- ---------------------------------------------------------------------------
-- contact_leads (φόρμα επικοινωνίας δημόσιου site — insert-only για anon)
-- ---------------------------------------------------------------------------
create table public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  message text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security — admin-only by default
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.projects enable row level security;
alter table public.project_phases enable row level security;
alter table public.contacts enable row level security;
alter table public.payments enable row level security;
alter table public.payment_installments enable row level security;
alter table public.expenses enable row level security;
alter table public.income enable row level security;
alter table public.supply_quantities enable row level security;
alter table public.contact_leads enable row level security;

create policy "admin full access" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access" on public.properties
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access" on public.project_phases
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access" on public.contacts
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access" on public.payments
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access" on public.payment_installments
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access" on public.expenses
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access" on public.income
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access" on public.supply_quantities
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin full access" on public.contact_leads
  for select using (public.is_admin());
create policy "anon can submit leads" on public.contact_leads
  for insert to anon with check (true);

-- ---------------------------------------------------------------------------
-- Public portfolio view — only safe columns, only published projects.
-- Owned by the migration role (table owner), so it can read past the
-- admin-only RLS above while only ever exposing this column subset —
-- financial fields (budget, etc.) are never reachable through it.
-- ---------------------------------------------------------------------------
create view public.public_projects
with (security_invoker = false)
as
select
  p.id,
  p.title,
  p.public_summary,
  p.scope_size,
  p.project_type,
  p.status,
  p.cover_image_url,
  p.start_date,
  p.end_date_actual,
  pr.name as property_name,
  pr.address as property_address
from public.projects p
join public.properties pr on pr.id = p.property_id
where p.show_on_website = true;

grant select on public.public_projects to anon, authenticated;
