-- Ejecuta este archivo primero (Supabase → SQL Editor → New query → Run)
create table miembros (id bigint primary key, nombre text not null unique, alq_freq text check (alq_freq in ('semanal','mensual')), diezmante boolean not null default false);
create table domingos (id bigint primary key, fecha date not null, servicio text not null default '', monto numeric(12,2) not null default 0);
create table ofrenda_alquiler (id bigint primary key, fecha date not null, miembro_id bigint not null references miembros(id), monto numeric(12,2) not null, nota text);
create table diezmos (id bigint primary key, fecha date not null, miembro_id bigint not null references miembros(id), monto numeric(12,2) not null);
create table gastos (id bigint primary key, fecha date not null, tipo text not null check (tipo in ('Alquiler','Internet','Distrital','Variado')), detalle text not null default '', monto numeric(12,2) not null);
create table meses (mes text primary key, ofrenda_pastoral numeric(12,2) not null default 0, caja_anterior numeric(12,2), caja_real numeric(12,2), cerrado boolean not null default false);

-- Seguridad: solo usuarios con sesión iniciada pueden leer y escribir
do $$ declare t text; begin
  foreach t in array array['miembros','domingos','ofrenda_alquiler','diezmos','gastos','meses'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "solo autenticados" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;
