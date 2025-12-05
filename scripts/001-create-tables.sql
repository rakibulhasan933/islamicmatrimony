-- Create enums
CREATE TYPE gender AS ENUM ('male', 'female');
CREATE TYPE marital_status AS ENUM ('unmarried', 'divorced', 'widow', 'widower');
CREATE TYPE biodata_type AS ENUM ('bride', 'groom');
CREATE TYPE membership_type AS ENUM ('free', 'silver', 'gold');
CREATE TYPE membership_status AS ENUM ('active', 'expired', 'cancelled');

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_image TEXT,
    email_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Memberships table
CREATE TABLE memberships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type membership_type NOT NULL DEFAULT 'free',
    status membership_status NOT NULL DEFAULT 'active',
    contact_views_remaining INTEGER DEFAULT 0,
    contact_views_total INTEGER DEFAULT 0,
    starts_at TIMESTAMP DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Biodatas table
CREATE TABLE biodatas (
    id SERIAL PRIMARY KEY,
    biodata_no VARCHAR(20) NOT NULL UNIQUE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type biodata_type NOT NULL,
    photo TEXT,
    
    -- Personal Info
    full_name VARCHAR(255) NOT NULL,
    gender gender NOT NULL,
    date_of_birth TIMESTAMP,
    age INTEGER,
    height VARCHAR(20),
    weight VARCHAR(20),
    blood_group VARCHAR(10),
    complexion VARCHAR(50),
    
    -- Marital Info
    marital_status marital_status NOT NULL,
    
    -- Location
    permanent_district VARCHAR(100),
    permanent_address TEXT,
    current_district VARCHAR(100),
    current_address TEXT,
    
    -- Education
    education VARCHAR(255),
    education_details TEXT,
    
    -- Occupation
    occupation VARCHAR(255),
    occupation_details TEXT,
    monthly_income VARCHAR(50),
    
    -- Family Info
    father_name VARCHAR(255),
    father_occupation VARCHAR(255),
    mother_name VARCHAR(255),
    mother_occupation VARCHAR(255),
    siblings TEXT,
    
    -- Religious Info
    religious_practice VARCHAR(100),
    prayer_habit VARCHAR(100),
    wears_hijab BOOLEAN,
    has_beard BOOLEAN,
    
    -- Partner Preferences
    expected_age VARCHAR(50),
    expected_height VARCHAR(50),
    expected_education VARCHAR(255),
    expected_district VARCHAR(100),
    expected_marital_status VARCHAR(100),
    partner_qualities TEXT,
    
    -- Contact
    guardian_phone VARCHAR(20),
    guardian_relation VARCHAR(50),
    
    -- Status
    is_approved BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Contact views table (tracks which contacts user has viewed)
CREATE TABLE contact_views (
    id SERIAL PRIMARY KEY,
    viewer_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    biodata_id INTEGER REFERENCES biodatas(id) ON DELETE CASCADE NOT NULL,
    viewed_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(viewer_user_id, biodata_id)
);

-- Shortlist table (favorites)
CREATE TABLE shortlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    biodata_id INTEGER REFERENCES biodatas(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, biodata_id)
);

-- Create indexes for better performance
CREATE INDEX idx_biodatas_type ON biodatas(type);
CREATE INDEX idx_biodatas_marital_status ON biodatas(marital_status);
CREATE INDEX idx_biodatas_current_district ON biodatas(current_district);
CREATE INDEX idx_biodatas_age ON biodatas(age);
CREATE INDEX idx_biodatas_occupation ON biodatas(occupation);
CREATE INDEX idx_biodatas_is_published ON biodatas(is_published);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_contact_views_viewer ON contact_views(viewer_user_id);
CREATE INDEX idx_shortlists_user_id ON shortlists(user_id);
