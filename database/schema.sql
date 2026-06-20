-- GYAN-SETU DATABASE SCHEMA
-- Copy and paste these statements into the Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Classes Table
create table if not exists public.classes (
  id uuid primary key default uuid_generate_v4(),
  class_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Profiles / Users Table
-- Integrates with Supabase Auth (auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  email text unique not null,
  role text not null check (role in ('student', 'teacher', 'parent')),
  class_id uuid references public.classes(id) on delete set null,
  linked_student_id uuid references public.users(id) on delete set null, -- Used by parent role to track their child
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Questions Table
create table if not exists public.questions (
  id serial primary key,
  question_text text not null,
  sub_topic text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  marks integer not null,
  model_solution jsonb not null, -- Array of step marks and descriptions
  expected_answer text not null,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Submissions Table
create table if not exists public.submissions (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.users(id) on delete cascade,
  question_id integer references public.questions(id) on delete cascade,
  input_type text not null check (input_type in ('type', 'voice', 'photo')),
  student_answer text,
  image_urls text[], -- Array of worksheet page image links
  scored_marks numeric not null,
  total_marks integer not null,
  steps_feedback jsonb not null, -- Array of graded steps from LLM
  general_feedback text,
  graded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.classes enable row level security;
alter table public.users enable row level security;
alter table public.questions enable row level security;
alter table public.submissions enable row level security;

-- Setup RLS Policies for users
create policy "Allow public reading of users profiles" on public.users
  for select using (true);

create policy "Allow users to update their own profiles" on public.users
  for update using (auth.uid() = id);

create policy "Allow users to insert their own profiles" on public.users
  for insert with check (auth.uid() = id);

-- Setup RLS Policies for classes
create policy "Allow reading classes info" on public.classes
  for select using (true);

create policy "Allow authenticated users to insert classes" on public.classes
  for insert with check (auth.uid() is not null);

-- Setup RLS Policies for questions
create policy "Allow anyone to read questions" on public.questions
  for select using (true);

create policy "Allow teachers to manage questions" on public.questions
  for all using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'teacher'
    )
  );

create policy "Allow authenticated users to insert questions" on public.questions
  for insert with check (auth.uid() is not null);

-- Setup RLS Policies for submissions
create policy "Allow users to see relevant submissions" on public.submissions
  for select using (
    auth.uid() = student_id -- Students can see their own
    or exists ( -- Teachers can see their class submissions
      select 1 from public.users u
      where u.id = auth.uid() and u.role = 'teacher'
    )
    or exists ( -- Parents can see their linked child's submissions
      select 1 from public.users p
      where p.id = auth.uid() and p.role = 'parent' and p.linked_student_id = submissions.student_id
    )
  );

create policy "Allow students to insert submissions" on public.submissions
  for insert with check (auth.uid() = student_id);
