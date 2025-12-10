# 🔧 DATABASE MIGRATION GUIDE

**Issue:** `SQLITE_UNKNOWN: table user_balances has no column named agent_id`

**Solution:** Run the database migration to add the `agent_id` column

---

## ⚡ QUICK FIX (3 Steps)

### **Step 1: Start Your Development Server**
```bash
npm run dev
```

### **Step 2: Visit the Migration Page**
Open your browser and go to:
```
http://localhost:3000/admin/migrate-agent-column
```

### **Step 3: Run the Migration**
1. Click "Check Migration Status" button
2. If migration is needed, click "Run Migration" button
3. Wait for success message ✅
4. Done! You can now create agents and assign users!

---

## 📋 WHAT THE MIGRATION DOES

The migration adds the following to your database:

```sql
-- Add agent_id column
ALTER TABLE user_balances 
ADD COLUMN agent_id TEXT 
REFERENCES user(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX idx_user_balances_agent_id 
ON user_balances(agent_id);
```

**This enables:**
- ✅ Assigning users to agents
- ✅ Tracking which agent manages each user
- ✅ Agent-user relationship system
- ✅ Future commission tracking

---

## 🎯 ALTERNATIVE METHOD (Using API Directly)

If you prefer to use the API directly:

### **Check if migration is needed:**
```bash
# GET request
curl http://localhost:3000/api/admin/migrate-agent-column
```

### **Run the migration:**
```bash
# POST request
curl -X POST http://localhost:3000/api/admin/migrate-agent-column
```

---

## ✅ VERIFICATION

After running the migration, verify it worked:

1. **Try creating an agent:**
   - Go to Admin Panel → User Management
   - Click "Create User"
   - Set Role to "Agent"
   - Click "Create User"
   - Should succeed without errors ✅

2. **Try creating a user with agent:**
   - Go to Admin Panel → User Management
   - Click "Create User"
   - Set Role to "User"
   - Select an agent from dropdown
   - Click "Create User"
   - Should succeed without errors ✅

---

## 🔍 TROUBLESHOOTING

### **Error: "Migration already applied"**
✅ This is good! The column already exists. No action needed.

### **Error: "duplicate column name"**
✅ This is good! The column already exists. No action needed.

### **Error: "Failed to connect to database"**
❌ Check your `.env` file:
- `TURSO_CONNECTION_URL` should be set
- `TURSO_AUTH_TOKEN` should be set

### **Error: "Permission denied"**
❌ Make sure you're logged in as an admin

---

## 📁 FILES CREATED

1. **Migration API:** `src/app/api/admin/migrate-agent-column/route.ts`
   - GET: Check migration status
   - POST: Run migration

2. **Migration Page:** `src/app/admin/migrate-agent-column/page.tsx`
   - User-friendly UI to run migration
   - Status checking
   - Instructions

3. **SQL Migration:** `drizzle/migrations/add_agent_id_to_user_balances.sql`
   - SQL commands for reference

---

## 🚀 AFTER MIGRATION

Once migration is complete, you can:

1. **Create Agents:**
   - Admin Panel → User Management → Create User
   - Set Role = "Agent"
   - Automatic referral code generated

2. **Assign Users to Agents:**
   - Admin Panel → User Management → Create User
   - Set Role = "User"
   - Select agent from dropdown
   - User is linked to agent

3. **View Agent's Users:**
   - Admin Panel → Agent Management
   - Click "Details" on any agent
   - See all assigned users

---

## 💡 WHY THIS IS NEEDED

The `agent_id` column was added to the database schema (`src/db/schema.ts`) but the actual database table doesn't have it yet. 

**Schema (Code):** ✅ Has `agent_id`  
**Database (Turso):** ❌ Doesn't have `agent_id` yet

**Solution:** Run migration to sync database with schema

---

## 📞 QUICK SUMMARY

**Problem:** Database missing `agent_id` column  
**Solution:** Visit `http://localhost:3000/admin/migrate-agent-column`  
**Action:** Click "Run Migration" button  
**Result:** Agent-user system fully functional ✅

---

**Status:** Ready to migrate!  
**Time Required:** < 1 minute  
**Risk:** Low (only adds a column, doesn't modify existing data)

---

**Last Updated:** December 5, 2025  
**Migration:** Add agent_id to user_balances
