# Database Relations Documentation

## User Relations

### users -> shifts
- One-to-many relationship
- A user (guard) can have multiple shifts
- Foreign key: `shifts.guard_id` references `users.id`
- Used for tracking which guard is assigned to which shift

### users -> documents
- One-to-many relationship
- A user can have multiple documents
- Foreign key: `documents.user_id` references `users.id`
- Used for storing user verification documents

## Location Relations

### locations -> shifts
- One-to-many relationship
- A location can have multiple shifts
- Foreign key: `shifts.location_id` references `locations.id`
- Used for tracking where shifts take place

## Shift Relations

### shifts -> incidents
- One-to-many relationship
- A shift can have multiple incidents
- Foreign key: `incidents.shift_id` references `shifts.id`
- Used for tracking incidents during shifts

## Cascade Rules

### users
```sql
-- When a user is deleted:
-- 1. Archive their shifts instead of deleting
-- 2. Keep their documents for compliance
-- 3. Keep their incidents for record-keeping
```

### locations
```sql
-- When a location is deleted:
-- 1. Archive associated shifts
-- 2. Keep incidents for record-keeping
```

### shifts
```sql
-- When a shift is deleted:
-- 1. Archive associated incidents
```

## Indexing Strategy

### users
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### shifts
```sql
CREATE INDEX idx_shifts_guard ON shifts(guard_id);
CREATE INDEX idx_shifts_location ON shifts(location_id);
CREATE INDEX idx_shifts_status ON shifts(status);
CREATE INDEX idx_shifts_start_time ON shifts(start_time);
```

### documents
```sql
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
```

### locations
```sql
CREATE INDEX idx_locations_coordinates ON locations USING GIST(coordinates);
```

### incidents
```sql
CREATE INDEX idx_incidents_shift ON incidents(shift_id);
CREATE INDEX idx_incidents_severity ON incidents(severity);
```