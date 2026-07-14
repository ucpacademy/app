-- ==================== CORE TABLES ====================

-- 1. Profiles Table (User roles and metadata)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  roles TEXT[] DEFAULT '{student}' CHECK (roles <@ ARRAY['student', 'admin', 'moderator', 'teacher', 'institution_admin']::TEXT[]),
  full_name VARCHAR,
  email VARCHAR UNIQUE,
  avatar_url VARCHAR,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Majors Table (Academic majors/specializations)
CREATE TABLE majors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR UNIQUE NOT NULL,
  name_fr VARCHAR NOT NULL,
  name_ar VARCHAR NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  icon VARCHAR,
  color VARCHAR DEFAULT '#3b82f6',
  featured BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Branches Table (Branches within majors)
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  major_id UUID NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
  slug VARCHAR UNIQUE NOT NULL,
  title_fr VARCHAR NOT NULL,
  title_ar VARCHAR NOT NULL,
  content_fr TEXT,
  content_ar TEXT,
  featured_image VARCHAR,
  gallery JSON DEFAULT '[]',
  requirements_fr TEXT,
  requirements_ar TEXT,
  duration_months INT,
  level VARCHAR DEFAULT 'bachelor' CHECK (level IN ('certificate', 'diploma', 'bachelor', 'master', 'phd')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Institutions Table (Course providers and schools)
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR UNIQUE NOT NULL,
  name_fr VARCHAR NOT NULL,
  name_ar VARCHAR NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  website VARCHAR,
  logo_url VARCHAR,
  location_fr VARCHAR,
  location_ar VARCHAR,
  contact_email VARCHAR,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Institution Memberships (Teachers and staff attached to institutions)
CREATE TABLE institution_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'instructor' CHECK (role IN ('instructor', 'admin', 'staff')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(institution_id, user_id)
);

-- ==================== CONTENT & TRANSLATION ====================

-- 6. Branch Translations (Multi-language content for branches)
CREATE TABLE branch_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  lang VARCHAR NOT NULL CHECK (lang IN ('fr', 'ar')),
  title VARCHAR NOT NULL,
  benefits TEXT,
  faqs JSON DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(branch_id, lang)
);

-- 6b. Major Translations (Multi-language content for majors)
CREATE TABLE major_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  major_id UUID NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
  lang VARCHAR NOT NULL CHECK (lang IN ('fr', 'ar')),
  name VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(major_id, lang)
);

-- 5. Programs Table (Educational programs offered)
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title_fr VARCHAR NOT NULL,
  title_ar VARCHAR NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  duration_months INT,
  capacity INT,
  price_usd DECIMAL(10, 2),
  price_mad DECIMAL(10, 2),
  start_date DATE,
  end_date DATE,
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Courses Table (Individual courses within programs)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  title_fr VARCHAR NOT NULL,
  title_ar VARCHAR NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  credits INT,
  hours INT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Course Modules Table (Modules inside each course)
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title_fr VARCHAR NOT NULL,
  title_ar VARCHAR NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Lessons Table (Lessons and learning units)
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL,
  title_fr VARCHAR NOT NULL,
  title_ar VARCHAR NOT NULL,
  type VARCHAR DEFAULT 'video' CHECK (type IN ('video', 'article', 'quiz', 'project')),
  content_url VARCHAR,
  duration_minutes INT,
  order_index INT DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Lesson Progress Table (Track learner progress per lesson)
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  progress_percent INT DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ==================== ENGAGEMENT & INTERACTIONS ====================

-- 7. Inquiries Table (Student inquiries/contact submissions)
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  message TEXT,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'resolved', 'spam')),
  priority VARCHAR DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Reviews/Ratings Table (Student reviews for branches/programs)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title_fr VARCHAR,
  title_ar VARCHAR,
  content_fr TEXT,
  content_ar TEXT,
  helpful_count INT DEFAULT 0,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Enrollments Table (Student enrollment in programs)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'suspended')),
  progress_percent INT DEFAULT 0,
  certificate_url VARCHAR,
  completion_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, program_id)
);

-- 10. Bookmarks/Favorites Table (Students save branches/programs)
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (
    (branch_id IS NOT NULL AND program_id IS NULL) OR
    (branch_id IS NULL AND program_id IS NOT NULL)
  )
);

-- 11. Comments Table (Discussion/comments on branches)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11b. Program Announcements Table (Community Layer)
CREATE TABLE program_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) > 3),
  content TEXT NOT NULL,
  edited_at TIMESTAMPTZ
);

-- 11c. Program Posts Table (Discussion Forum / Community Layer)
CREATE TABLE program_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_post_id UUID REFERENCES program_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  edited_at TIMESTAMPTZ
);

-- ==================== ADMIN & CONTENT MANAGEMENT ====================

-- 12. Blog Posts Table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  title_fr VARCHAR NOT NULL,
  title_ar VARCHAR NOT NULL,
  slug_fr VARCHAR UNIQUE,
  slug_ar VARCHAR UNIQUE,
  content_fr TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  excerpt_fr VARCHAR(300),
  excerpt_ar VARCHAR(300),
  featured_image VARCHAR,
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_fr VARCHAR NOT NULL,
  title_ar VARCHAR NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location_fr VARCHAR,
  location_ar VARCHAR,
  event_url VARCHAR,
  image_url VARCHAR,
  capacity INT,
  registered_count INT DEFAULT 0,
  status VARCHAR DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Event Registrations Table
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  UNIQUE(event_id, email)
);

-- 15. FAQ Table
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR NOT NULL,
  question_fr VARCHAR NOT NULL,
  question_ar VARCHAR NOT NULL,
  answer_fr TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Contact Messages Table
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  subject VARCHAR NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  replied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Role Requests Table (For users upgrading to teachers/institutions)
CREATE TABLE role_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requested_role VARCHAR NOT NULL CHECK (requested_role IN ('teacher', 'institution_admin', 'moderator')),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES FOR PERFORMANCE =====================

CREATE INDEX idx_branches_major_id ON branches(major_id);
CREATE INDEX idx_branches_slug ON branches(slug);
CREATE INDEX idx_inquiries_branch_id ON inquiries(branch_id);
CREATE INDEX idx_inquiries_user_id ON inquiries(user_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX idx_reviews_branch_id ON reviews(branch_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_program_id ON enrollments(program_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_comments_branch_id ON comments(branch_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_institution_memberships_institution_id ON institution_memberships(institution_id);
CREATE INDEX idx_programs_instructor_id ON programs(instructor_id);
CREATE INDEX idx_programs_institution_id ON programs(institution_id);
CREATE INDEX idx_courses_program_id ON courses(program_id);
CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX idx_role_requests_user_id ON role_requests(user_id);
CREATE INDEX idx_role_requests_status ON role_requests(status);
CREATE INDEX idx_program_announcements_program_id ON program_announcements(program_id);
CREATE INDEX idx_program_posts_program_id ON program_posts(program_id);
CREATE INDEX idx_program_posts_parent_post_id ON program_posts(parent_post_id);

-- ==================== TRIGGERS & FUNCTIONS ====================

-- Trigger to create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_role VARCHAR;
  assigned_roles TEXT[];
BEGIN
  requested_role := NEW.raw_user_meta_data->>'role';
  
  -- Only allow public signups for specific roles, default to student. 
  -- Admins and moderators must be manually elevated.
  IF requested_role IN ('student', 'teacher', 'institution_admin') THEN
    assigned_roles := ARRAY[requested_role];
  ELSE
    assigned_roles := ARRAY['student'];
  END IF;

  INSERT INTO public.profiles (id, email, full_name, roles)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    assigned_roles
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RPC function to add a major with translations
CREATE OR REPLACE FUNCTION public.add_major(
  p_slug VARCHAR,
  p_name_fr VARCHAR,
  p_name_ar VARCHAR
)
RETURNS UUID AS $$
DECLARE
  v_major_id UUID;
BEGIN
  -- Insert major
  INSERT INTO majors (slug, name_fr, name_ar)
  VALUES (p_slug, p_name_fr, p_name_ar)
  RETURNING id INTO v_major_id;

  -- Insert translations
  INSERT INTO major_translations (major_id, lang, name)
  VALUES
    (v_major_id, 'fr', p_name_fr),
    (v_major_id, 'ar', p_name_ar);

  RETURN v_major_id;
END;
$$ LANGUAGE plpgsql;

-- RPC function to add a branch with translations
CREATE OR REPLACE FUNCTION public.add_branch(
  p_major_id UUID,
  p_slug VARCHAR,
  p_title_fr VARCHAR,
  p_title_ar VARCHAR
)
RETURNS UUID AS $$
DECLARE
  v_branch_id UUID;
BEGIN
  -- Insert branch
  INSERT INTO branches (major_id, slug, title_fr, title_ar)
  VALUES (p_major_id, p_slug, p_title_fr, p_title_ar)
  RETURNING id INTO v_branch_id;

  -- Insert translations
  INSERT INTO branch_translations (branch_id, lang, title)
  VALUES
    (v_branch_id, 'fr', p_title_fr),
    (v_branch_id, 'ar', p_title_ar);

  RETURN v_branch_id;
END;
$$ LANGUAGE plpgsql;

-- Function to safely get user roles without triggering RLS infinite recursion
CREATE OR REPLACE FUNCTION public.get_user_roles()
RETURNS TEXT[] AS $$
  SELECT roles FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if the current user is enrolled in a specific program.
CREATE OR REPLACE FUNCTION public.is_enrolled(program_id_to_check UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM enrollments
    WHERE
      program_id = program_id_to_check AND
      user_id = auth.uid()
  );
$$;

-- Helper function to check if the current user is the owner (instructor or part of institution) of a program.
CREATE OR REPLACE FUNCTION public.is_program_owner(program_id_to_check UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM programs p
    LEFT JOIN institution_memberships im ON im.institution_id = p.institution_id
    WHERE
      p.id = program_id_to_check AND
      (
        p.instructor_id = auth.uid() OR
        im.user_id = auth.uid()
      )
  );
$$;

-- ==================== ROW LEVEL SECURITY ====================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_posts ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING ('admin' = ANY(public.get_user_roles()));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Inquiries RLS - Users can see their own, admins see all
CREATE POLICY "Users can see their own inquiries"
  ON inquiries FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can see all inquiries" ON inquiries;
CREATE POLICY "Admins can see all inquiries"
  ON inquiries FOR SELECT
  USING ('admin' = ANY(public.get_user_roles()) OR 'moderator' = ANY(public.get_user_roles()));

-- Enrollments RLS
CREATE POLICY "Users can see their own enrollments"
  ON enrollments FOR SELECT
  USING (user_id = auth.uid());

-- Bookmarks RLS
CREATE POLICY "Users can see their own bookmarks"
  ON bookmarks FOR SELECT
  USING (user_id = auth.uid());

-- Reviews RLS
CREATE POLICY "Anyone can read approved reviews"
  ON reviews FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid());

-- Comments RLS
CREATE POLICY "Anyone can read approved comments"
  ON comments FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid());

-- Role Requests RLS
CREATE POLICY "Users can view their own requests"
  ON role_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own requests"
  ON role_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all requests"
  ON role_requests FOR SELECT
  USING ('admin' = ANY(public.get_user_roles()));

CREATE POLICY "Admins can update requests"
  ON role_requests FOR UPDATE
  USING ('admin' = ANY(public.get_user_roles()));

-- Program Announcements RLS
CREATE POLICY "Allow enrolled students to read announcements" ON program_announcements FOR SELECT USING ( public.is_enrolled(program_id) );
CREATE POLICY "Allow program owners to create announcements" ON program_announcements FOR INSERT WITH CHECK ( public.is_program_owner(program_id) AND author_id = auth.uid() );
CREATE POLICY "Allow program owners to update announcements" ON program_announcements FOR UPDATE USING ( public.is_program_owner(program_id) AND author_id = auth.uid() );
CREATE POLICY "Allow program owners to delete announcements" ON program_announcements FOR DELETE USING ( public.is_program_owner(program_id) AND author_id = auth.uid() );

-- Program Posts RLS
CREATE POLICY "Allow enrolled users to read posts" ON program_posts FOR SELECT USING ( public.is_enrolled(program_id) );
CREATE POLICY "Allow enrolled users to create posts" ON program_posts FOR INSERT WITH CHECK ( public.is_enrolled(program_id) AND author_id = auth.uid() );
CREATE POLICY "Allow authors to update their own posts" ON program_posts FOR UPDATE USING ( author_id = auth.uid() );
CREATE POLICY "Allow authors to delete their own posts" ON program_posts FOR DELETE USING ( author_id = auth.uid() );
CREATE POLICY "Allow program owners to moderate posts" ON program_posts FOR DELETE USING ( public.is_program_owner(program_id) );