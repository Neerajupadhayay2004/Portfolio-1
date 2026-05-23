-- SQL Setup script for Portfolio Database Synchronization
-- Run this in your Supabase SQL Editor to create the tables and configure Row Level Security.

-- 1. Tech Stack Table
CREATE TABLE IF NOT EXISTS public.tech_stack (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
  color TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tech_stack ENABLE ROW LEVEL SECURITY;

-- Create policies for tech_stack (allowing all public users to sync/read/write)
CREATE POLICY "Allow public read access for tech_stack" 
  ON public.tech_stack FOR SELECT USING (true);

CREATE POLICY "Allow public insert access for tech_stack" 
  ON public.tech_stack FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access for tech_stack" 
  ON public.tech_stack FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access for tech_stack" 
  ON public.tech_stack FOR DELETE USING (true);


-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  name TEXT NOT NULL UNIQUE,
  tag TEXT NOT NULL,
  "desc" TEXT NOT NULL, -- Double quotes allow using 'desc' as a column name (avoiding SQL keyword conflict)
  stack TEXT[] NOT NULL DEFAULT '{}',
  live TEXT,
  code TEXT,
  deploy TEXT,
  docs TEXT,
  video TEXT,
  status TEXT,
  custom BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects (allowing all public users to sync/read/write)
CREATE POLICY "Allow public read access for projects" 
  ON public.projects FOR SELECT USING (true);

CREATE POLICY "Allow public insert access for projects" 
  ON public.projects FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access for projects" 
  ON public.projects FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access for projects" 
  ON public.projects FOR DELETE USING (true);
