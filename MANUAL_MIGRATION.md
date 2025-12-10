# 🔧 MANUAL MIGRATION GUIDE

If the automatic migration didn't work, you need to run the SQL directly on your Turso database.

## Option 1: Using Turso CLI

```bash
# Install Turso CLI (if not installed)
curl -sSfL https://get.tur.so/install.sh | bash

# Login to Turso
turso auth login

# List your databases
turso db list

# Connect to your database
turso db shell [your-database-name]

# Run the migration
ALTER TABLE user_balances ADD COLUMN agent_id TEXT;
CREATE INDEX idx_user_balances_agent_id ON user_balances(agent_id);
```

## Option 2: Using Turso Dashboard

1. Go to https://turso.tech/
2. Login to your account
3. Select your database
4. Go to "SQL Console"
5. Run these commands:

```sql
ALTER TABLE user_balances ADD COLUMN agent_id TEXT;
CREATE INDEX idx_user_balances_agent_id ON user_balances(agent_id);
```

## Option 3: Using Drizzle Kit

```bash
# Generate migration
npx drizzle-kit generate:sqlite

# Push to database
npx drizzle-kit push:sqlite
```

## Verify Migration

After running the migration, verify it worked:

```sql
PRAGMA table_info(user_balances);
```

You should see `agent_id` in the column list.

## If All Else Fails

Contact Turso support or check their documentation:
https://docs.turso.tech/
