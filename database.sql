-- 1. Create Majors Table
CREATE TABLE majors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR UNIQUE NOT NULL,
  name_fr VARCHAR NOT NULL,
  name_ar VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Branches Table (Linked to Majors)
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  major_id UUID REFERENCES majors(id) ON DELETE CASCADE,
  slug VARCHAR UNIQUE NOT NULL,
  title_fr VARCHAR NOT NULL,
  title_ar VARCHAR NOT NULL,
  content_fr TEXT,
  content_ar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Profiles Table (For Roles like Student vs Admin)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role VARCHAR DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  full_name VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW()
);