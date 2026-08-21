-- Storage bucket for project cover photos.
-- Public read (needed so the marketing site's portfolio can show the image),
-- admin-only write.

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "Public read project images"
on storage.objects for select
using (bucket_id = 'project-images');

create policy "Admins can upload project images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-images' and public.is_admin());

create policy "Admins can update project images"
on storage.objects for update
to authenticated
using (bucket_id = 'project-images' and public.is_admin());

create policy "Admins can delete project images"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-images' and public.is_admin());
