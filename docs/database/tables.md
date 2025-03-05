# Database Tables Specification

## users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
    ON users FOR SELECT
    USING (auth.role() = 'admin');
```

## shifts
```sql
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES locations(id),
    guard_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guards can read assigned shifts"
    ON shifts FOR SELECT
    USING (auth.uid() = guard_id);

CREATE POLICY "Admins can manage all shifts"
    ON shifts
    USING (auth.role() = 'admin');
```

## documents
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own documents"
    ON documents
    USING (auth.uid() = user_id);
```

## locations
```sql
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    coordinates POINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public locations are readable"
    ON locations FOR SELECT
    USING (true);
```

## incidents
```sql
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_id UUID REFERENCES shifts(id),
    description TEXT NOT NULL,
    severity TEXT NOT NULL,
    reported_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guards can report incidents"
    ON incidents FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM shifts
        WHERE shifts.id = shift_id
        AND shifts.guard_id = auth.uid()
    ));
```