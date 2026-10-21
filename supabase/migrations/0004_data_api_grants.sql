-- Data API grants. From 30 October 2026 Supabase no longer grants new tables in
-- "public" to the API roles automatically, so a fresh setup (new project, preview
-- branch, `supabase db reset`) needs these. RLS still decides which rows each role sees.
-- anon only gets what an RLS policy opens to visitors who are not signed in.

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

grant select, insert, update, delete on public.properties to authenticated;
grant select, insert, update, delete on public.properties to service_role;

grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.projects to service_role;

grant select, insert, update, delete on public.project_phases to authenticated;
grant select, insert, update, delete on public.project_phases to service_role;

grant select, insert, update, delete on public.contacts to authenticated;
grant select, insert, update, delete on public.contacts to service_role;

grant select, insert, update, delete on public.payments to authenticated;
grant select, insert, update, delete on public.payments to service_role;

grant select, insert, update, delete on public.payment_installments to authenticated;
grant select, insert, update, delete on public.payment_installments to service_role;

grant select, insert, update, delete on public.expenses to authenticated;
grant select, insert, update, delete on public.expenses to service_role;

grant select, insert, update, delete on public.income to authenticated;
grant select, insert, update, delete on public.income to service_role;

grant select, insert, update, delete on public.supply_quantities to authenticated;
grant select, insert, update, delete on public.supply_quantities to service_role;

grant insert on public.contact_leads to anon;
grant select, insert, update, delete on public.contact_leads to authenticated;
grant select, insert, update, delete on public.contact_leads to service_role;

grant select, insert, update, delete on public.permissions to authenticated;
grant select, insert, update, delete on public.permissions to service_role;
