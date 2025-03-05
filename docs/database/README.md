# Database Schema Documentation

## Overview
SentWatch uses Supabase (PostgreSQL) as the primary database. This document outlines the database schema, relationships, and security policies.

## Schema Diagram
```mermaid
erDiagram
    users ||--o{ shifts : "works"
    users ||--o{ documents : "owns"
    users ||--o{ locations : "manages"
    shifts ||--o{ incidents : "has"
    locations ||--o{ shifts : "hosts"

    users {
        uuid id PK
        string email
        string full_name
        string role
        timestamp created_at
        timestamp updated_at
    }

    shifts {
        uuid id PK
        uuid location_id FK
        uuid guard_id FK
        string title
        timestamp start_time
        timestamp end_time
        string status
        timestamp created_at
    }

    documents {
        uuid id PK
        uuid user_id FK
        string type
        string status
        string url
        timestamp uploaded_at
    }

    locations {
        uuid id PK
        string name
        string address
        point coordinates
        timestamp created_at
    }

    incidents {
        uuid id PK
        uuid shift_id FK
        string description
        string severity
        timestamp reported_at
    }
```

## Tables

### users
Primary table for all user accounts.

### shifts
Stores all security shifts and assignments.

### documents
Manages user documents and verifications.

### locations
Stores all security locations and sites.

### incidents
Records security incidents during shifts.

## Security Policies
All tables implement Row Level Security (RLS) with specific policies for each user role.