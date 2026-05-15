-- ═══════════════════════════════════════════════════════════════
-- Physioflex — Supabase Database Schema
-- Paste this into: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════

-- ─── Enums ────────────────────────────────────────────────────
create type user_role as enum ('patient', 'therapist', 'admin');
create type appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
create type invoice_status as enum ('unpaid', 'paid', 'partially_paid', 'void');
create type review_status as enum ('pending', 'approved', 'rejected');

-- ─── Profiles (extends auth.users) ────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       user_role not null default 'patient',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, coalesce((new.raw_user_meta_data->>'role')::user_role, 'patient'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Patients ─────────────────────────────────────────────────
create table public.patients (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null unique references public.profiles(id) on delete cascade,
  first_name          text not null,
  last_name           text not null,
  phone               text,
  whatsapp            text,
  date_of_birth       date,
  gender              text,
  address             text,
  suburb              text,
  emergency_name      text,
  emergency_phone     text,
  medical_aid_name    text,
  medical_aid_number  text,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── Therapists ───────────────────────────────────────────────
create table public.therapists (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid unique references public.profiles(id) on delete set null,
  first_name       text not null,
  last_name        text not null,
  title            text not null,
  hpcna_number     text not null,
  bio              text,
  photo            text,
  specialisations  text[] not null default '{}',
  languages        text[] not null default '{}',
  years_experience int not null default 0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─── Services ─────────────────────────────────────────────────
create table public.services (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  duration_min int not null default 60,
  price_nad    numeric(10,2) not null,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ─── Appointments ─────────────────────────────────────────────
create table public.appointments (
  id           uuid primary key default gen_random_uuid(),
  patient_id   uuid not null references public.patients(id),
  therapist_id uuid not null references public.therapists(id),
  service_id   uuid not null references public.services(id),
  starts_at    timestamptz not null,
  ends_at      timestamptz not null,
  status       appointment_status not null default 'pending',
  notes        text,
  reference    text not null unique default upper(substring(gen_random_uuid()::text, 1, 8)),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── Invoices ─────────────────────────────────────────────────
create table public.invoices (
  id             uuid primary key default gen_random_uuid(),
  patient_id     uuid not null references public.patients(id),
  appointment_id uuid unique references public.appointments(id) on delete set null,
  number         text not null unique,
  amount_nad     numeric(10,2) not null,
  status         invoice_status not null default 'unpaid',
  paid_at        timestamptz,
  pdf_url        text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ─── Reviews ──────────────────────────────────────────────────
create table public.reviews (
  id               uuid primary key default gen_random_uuid(),
  patient_id       uuid references public.patients(id) on delete set null,
  appointment_id   uuid unique references public.appointments(id) on delete set null,
  display_name     text not null,
  suburb           text,
  service_id       uuid references public.services(id) on delete set null,
  rating           int not null check (rating between 1 and 5),
  body             text not null check (char_length(body) >= 20),
  status           review_status not null default 'pending',
  helpful_count    int not null default 0,
  admin_reply      text,
  admin_replied_at timestamptz,
  verified_patient boolean not null default false,
  created_at       timestamptz not null default now()
);

-- ─── Messages ─────────────────────────────────────────────────
create table public.messages (
  id             uuid primary key default gen_random_uuid(),
  sender_id      uuid not null references public.profiles(id) on delete cascade,
  recipient_id   uuid not null references public.profiles(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  subject        text,
  body           text not null,
  is_read        boolean not null default false,
  created_at     timestamptz not null default now()
);

-- ─── Progress Logs ────────────────────────────────────────────
create table public.progress_logs (
  id         uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  date       date not null default current_date,
  pain_score int not null check (pain_score between 0 and 10),
  notes      text,
  created_at timestamptz not null default now()
);

-- ─── Row Level Security ───────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.patients      enable row level security;
alter table public.therapists    enable row level security;
alter table public.services      enable row level security;
alter table public.appointments  enable row level security;
alter table public.invoices      enable row level security;
alter table public.reviews       enable row level security;
alter table public.messages      enable row level security;
alter table public.progress_logs enable row level security;

-- Profiles: users can read/update their own
create policy "profiles: own read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id);

-- Patients: own record
create policy "patients: own"   on public.patients for all using (auth.uid() = user_id);

-- Therapists: anyone can read active therapists; therapists manage their own
create policy "therapists: public read" on public.therapists for select using (is_active = true);
create policy "therapists: own update" on public.therapists for update using (auth.uid() = user_id);

-- Services: public read
create policy "services: public read" on public.services for select using (is_active = true);

-- Appointments: patients see their own; therapists see theirs
create policy "appointments: patient" on public.appointments for select
  using (patient_id in (select id from public.patients where user_id = auth.uid()));
create policy "appointments: therapist" on public.appointments for select
  using (therapist_id in (select id from public.therapists where user_id = auth.uid()));

-- Invoices: patients see their own
create policy "invoices: patient" on public.invoices for select
  using (patient_id in (select id from public.patients where user_id = auth.uid()));

-- Reviews: approved reviews are public
create policy "reviews: public read" on public.reviews for select using (status = 'approved');
create policy "reviews: patient insert" on public.reviews for insert
  with check (patient_id in (select id from public.patients where user_id = auth.uid()));

-- Messages: sender and recipient
create policy "messages: participants" on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "messages: send" on public.messages for insert
  with check (auth.uid() = sender_id);

-- Progress logs: own
create policy "progress: own" on public.progress_logs for all
  using (patient_id in (select id from public.patients where user_id = auth.uid()));

-- ─── Seed: Services ───────────────────────────────────────────
insert into public.services (name, description, duration_min, price_nad) values
  ('Initial Assessment',       'Comprehensive first consultation and movement analysis.',       60,  550.00),
  ('Follow-up Session',        'Treatment session based on your personalised plan.',            45,  420.00),
  ('Sports Rehabilitation',    'Targeted rehab for sports injuries and performance recovery.',  60,  500.00),
  ('Manual Therapy',           'Hands-on joint mobilisation and soft tissue techniques.',      45,  450.00),
  ('Dry Needling',             'Trigger point needling for muscle tension and pain relief.',    30,  380.00),
  ('Post-Surgery Rehabilitation', 'Structured recovery programme after surgical procedures.', 60,  500.00),
  ('Neurological Rehabilitation', 'Specialist rehabilitation for neurological conditions.',    60,  550.00),
  ('Paediatric Physiotherapy', 'Gentle, play-based physiotherapy for children.',               45,  420.00);

-- ─── Seed: Therapists ─────────────────────────────────────────
insert into public.therapists (first_name, last_name, title, hpcna_number, specialisations, languages, years_experience, is_active) values
  ('Anri',   'van der Berg', 'Senior Physiotherapist',            'PT-2847', ARRAY['Sports Rehabilitation','Dry Needling','Pain Management'],            ARRAY['English','Afrikaans'],                 12, true),
  ('Marco',  'Shiimi',       'Sports Rehabilitation Specialist',  'PT-3921', ARRAY['Sports Injuries','ACL Recovery','Strength & Conditioning'],          ARRAY['English','Oshiwambo'],                 8,  true),
  ('Liesl',  'Haussmann',    'Manual Therapy Specialist',         'PT-4156', ARRAY['Manual Therapy','Spinal Assessment','Post-Surgical Rehab'],          ARRAY['English','Afrikaans','German'],         10, true),
  ('David',  'Naango',       'Neurological Rehabilitation Specialist', 'PT-5033', ARRAY['Neurological Rehab','Stroke Recovery','Paediatric Physio'],    ARRAY['English','Oshiwambo','Otjiherero'],     7,  true);
