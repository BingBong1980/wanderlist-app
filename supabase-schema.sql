-- Wanderlist Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Spots table
CREATE TABLE IF NOT EXISTS spots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description TEXT,
  photo_url TEXT,
  state TEXT,
  city TEXT,
  heart_count INTEGER DEFAULT 0,
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User lists table
CREATE TABLE IF NOT EXISTS user_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- List spots (spots saved to lists)
CREATE TABLE IF NOT EXISTS list_spots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  list_id UUID REFERENCES user_lists(id) ON DELETE CASCADE NOT NULL,
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(list_id, spot_id)
);

-- Hearts (users who hearted a spot)
CREATE TABLE IF NOT EXISTS hearts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, spot_id)
);

-- Submissions (user-submitted spots awaiting approval)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description TEXT,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearts ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Spots: anyone can read, only admins can write
CREATE POLICY "Anyone can read spots" ON spots FOR SELECT USING (true);
CREATE POLICY "Only admins can insert spots" ON spots FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'Sjgloss74@yahoo.com');
CREATE POLICY "Only admins can update spots" ON spots FOR UPDATE USING (auth.jwt() ->> 'email' = 'Sjgloss74@yahoo.com');
CREATE POLICY "Only admins can delete spots" ON spots FOR DELETE USING (auth.jwt() ->> 'email' = 'Sjgloss74@yahoo.com');

-- User lists: users can only see/edit their own lists
CREATE POLICY "Users can read own lists" ON user_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create lists" ON user_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own lists" ON user_lists FOR DELETE USING (auth.uid() = user_id);

-- List spots: users can manage their own list spots
CREATE POLICY "Users can read own list spots" ON list_spots FOR SELECT USING (
  list_id IN (SELECT id FROM user_lists WHERE user_id = auth.uid())
);
CREATE POLICY "Users can add spots to their lists" ON list_spots FOR INSERT WITH CHECK (
  list_id IN (SELECT id FROM user_lists WHERE user_id = auth.uid())
);
CREATE POLICY "Users can remove spots from their lists" ON list_spots FOR DELETE USING (
  list_id IN (SELECT id FROM user_lists WHERE user_id = auth.uid())
);

-- Hearts: users can manage their own hearts
CREATE POLICY "Users can read all hearts" ON hearts FOR SELECT USING (true);
CREATE POLICY "Users can add hearts" ON hearts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove hearts" ON hearts FOR DELETE USING (auth.uid() = user_id);

-- Submissions: authenticated users can submit, admins can manage
CREATE POLICY "Authenticated users can submit" ON submissions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can read submissions" ON submissions FOR SELECT USING (auth.jwt() ->> 'email' = 'Sjgloss74@yahoo.com');
CREATE POLICY "Admins can update submissions" ON submissions FOR UPDATE USING (auth.jwt() ->> 'email' = 'Sjgloss74@yahoo.com');
