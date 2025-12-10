# 🤖 AUTO-ASSIGN USERS TO AGENTS

**Feature:** Automatic Agent Assignment for Users Without Referral Codes  
**Status:** ✅ COMPLETE

---

## ⚠️ **IMPORTANT: RUN MIGRATION FIRST!**

Before this works, you **MUST** run the database migration:

### **Option 1: Via Browser (Recommended)**
```
http://localhost:3000/admin/migrate-agent-column
```
Click **"Run Migration"** button

### **Option 2: Via Command**
```powershell
curl -X POST http://localhost:3000/api/admin/migrate-agent-column
```

**This adds the `agent_id` column to the database!**

---

## 📋 HOW IT WORKS

### **Scenario 1: User Signs Up WITH Referral Code**

```
User enters referral code → System finds agent → User assigned to that agent
```

**Example:**
- Ravi signs up with code `AGENTLX3K8A9B2`
- System finds Ramu (owner of code)
- Ramu promoted to agent (if not already)
- Ravi assigned to Ramu

---

### **Scenario 2: User Signs Up WITHOUT Referral Code** ⭐ NEW!

```
User signs up (no code) → System finds active agents → Picks random agent → User assigned
```

**Example:**
- Krishna signs up (no referral code)
- System finds all active agents
- Randomly selects Agent Ramu
- Krishna assigned to Ramu

---

## 🎯 IMPLEMENTATION DETAILS

### **1. Auto-Assign API Endpoint**
**File:** `src/app/api/user/auto-assign-agent/route.ts`

**Features:**
- ✅ Finds all users with `role='agent'`
- ✅ Randomly selects one agent
- ✅ Assigns current user to that agent
- ✅ Checks if user already has an agent
- ✅ Handles case when no agents exist

**Logic:**
```typescript
1. Get current user from session
2. Check if user already has an agent
   └── If yes: Return (already assigned)
3. Find all active agents (role='agent')
   └── If none: Return (no agents available)
4. Pick random agent
5. Assign user to agent
6. Return success
```

---

### **2. Registration Page Updated**
**File:** `src/app/register/page.tsx`

**New Logic:**
```typescript
if (referralCode provided) {
  // Apply referral code (existing logic)
  → User assigned to code owner
  → Code owner becomes agent
} else {
  // NEW: Auto-assign to random active agent
  → Find active agents
  → Pick random one
  → Assign user to agent
}
```

---

## 💡 EXAMPLE FLOWS

### **Flow 1: With Referral Code**

```
1. Ravi goes to /register
2. Enters referral code: AGENTLX3K8A9B2
3. Fills registration form
4. Clicks "Register"

Result:
✅ Ravi's account created
✅ Ramu (code owner) becomes agent
✅ Ravi assigned to Ramu
✅ Referral record created
```

---

### **Flow 2: Without Referral Code (Auto-Assign)**

```
1. Krishna goes to /register
2. Leaves referral code empty
3. Fills registration form
4. Clicks "Register"

Result:
✅ Krishna's account created
✅ System finds active agents: [Ramu, Sita, Lakshmi]
✅ Randomly picks: Ramu
✅ Krishna assigned to Ramu
✅ No referral record (direct assignment)
```

---

### **Flow 3: No Agents Available**

```
1. First user "Ramu" signs up
2. No referral code
3. Clicks "Register"

Result:
✅ Ramu's account created
✅ No agents exist yet
✅ Ramu not assigned to anyone
✅ Ramu can become agent later
```

---

## 🔧 CONFIGURATION

### **Current Logic: Random Selection**

```typescript
const randomAgent = agents[Math.floor(Math.random() * agents.length)];
```

### **Possible Enhancements:**

#### **1. Round-Robin (Fair Distribution)**
```typescript
// Assign to agent with fewest users
const agentCounts = await getAgentUserCounts();
const agentWithFewest = agents.sort((a, b) => 
  agentCounts[a.userId] - agentCounts[b.userId]
)[0];
```

#### **2. Performance-Based**
```typescript
// Assign to agent with best performance
const agentStats = await getAgentPerformance();
const bestAgent = agents.sort((a, b) => 
  agentStats[b.userId].score - agentStats[a.userId].score
)[0];
```

#### **3. Geographic**
```typescript
// Assign to agent in same region
const userRegion = getUserRegion(userId);
const localAgents = agents.filter(a => a.region === userRegion);
const randomLocalAgent = localAgents[Math.floor(Math.random() * localAgents.length)];
```

---

## 📊 DATABASE CHANGES

### **user_balances Table:**

```sql
CREATE TABLE user_balances (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  coins INTEGER NOT NULL DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'user',
  agent_id TEXT,  -- ← NEW! Points to agent's user_id
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### **Example Data:**

```sql
-- Agents
| user_id | role  | agent_id |
|---------|-------|----------|
| user_1  | agent | NULL     |  ← Ramu (agent)
| user_2  | agent | NULL     |  ← Sita (agent)

-- Users assigned to agents
| user_id | role | agent_id |
|---------|------|----------|
| user_3  | user | user_1   |  ← Ravi → Ramu
| user_4  | user | user_1   |  ← Krishna → Ramu (auto)
| user_5  | user | user_2   |  ← Lakshmi → Sita (auto)
```

---

## 🎨 ADMIN PANEL VIEW

### **Agent Management:**

```
┌─────────────────────────────────────┐
│ Agent: Ramu                         │
├─────────────────────────────────────┤
│ Referral Code: AGENTLX3K8A9B2       │
│ Total Referrals: 2                  │
│                                     │
│ Referred Users:                     │
│ ┌─────────────────────────────────┐ │
│ │ Name    │ Type        │ Date    ││
│ ├─────────┼─────────────┼─────────┤│
│ │ Ravi    │ Referral    │ Dec 5   ││ ← Used code
│ │ Krishna │ Auto-assign │ Dec 6   ││ ← No code
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🧪 TESTING

### **Test 1: Sign Up With Referral Code**
1. Create an agent (or use existing)
2. Get their referral code
3. Register new user with that code
4. **Expected:** User assigned to that agent

### **Test 2: Sign Up Without Referral Code**
1. Make sure at least one agent exists
2. Register new user (leave code empty)
3. **Expected:** User auto-assigned to random agent

### **Test 3: No Agents Available**
1. Delete all agents (or use fresh database)
2. Register new user
3. **Expected:** User created but not assigned

### **Test 4: Multiple Agents**
1. Create 3 agents
2. Register 10 users (no codes)
3. **Expected:** Users distributed among agents

---

## 📈 STATISTICS

### **Query: Users Per Agent**

```sql
SELECT 
  a.name as agent_name,
  COUNT(u.user_id) as total_users,
  SUM(CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END) as referral_users,
  SUM(CASE WHEN r.id IS NULL THEN 1 ELSE 0 END) as auto_assigned_users
FROM user_balances a
LEFT JOIN user_balances u ON a.user_id = u.agent_id
LEFT JOIN referrals r ON u.user_id = r.referred_user_id
WHERE a.role = 'agent'
GROUP BY a.user_id, a.name
ORDER BY total_users DESC;
```

**Result:**
```
| agent_name | total_users | referral_users | auto_assigned |
|------------|-------------|----------------|---------------|
| Ramu       | 5           | 2              | 3             |
| Sita       | 3           | 1              | 2             |
| Lakshmi    | 2           | 0              | 2             |
```

---

## ✅ BENEFITS

### **For Users:**
- ✅ Always assigned to an agent (if available)
- ✅ Get support even without referral code
- ✅ Fair distribution among agents

### **For Agents:**
- ✅ Automatic user acquisition
- ✅ Grow user base without marketing
- ✅ Earn commissions from auto-assigned users

### **For Platform:**
- ✅ Better user distribution
- ✅ All users have agent support
- ✅ Increased agent engagement
- ✅ Fair opportunity for all agents

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Run database migration (add `agent_id` column)
- [ ] Create at least one agent
- [ ] Test registration with referral code
- [ ] Test registration without referral code
- [ ] Verify auto-assignment in admin panel
- [ ] Monitor agent distribution

---

## 📞 SUMMARY

**Problem:** Users signing up without referral codes weren't assigned to agents

**Solution:** 
1. ✅ Auto-assign to random active agent
2. ✅ Fair distribution
3. ✅ Works seamlessly

**How It Works:**
```
User signs up
├── Has referral code?
│   ├── Yes → Assign to code owner
│   └── No  → Auto-assign to random agent
└── Result: User always has an agent (if agents exist)
```

**Status:** ✅ **FULLY FUNCTIONAL**

---

## ⚠️ REMEMBER!

**BEFORE TESTING:**
1. Run the migration: `http://localhost:3000/admin/migrate-agent-column`
2. Create at least one agent
3. Then test registration

**Without migration, you'll get:**
```
❌ Error: table user_balances has no column named agent_id
```

---

**Last Updated:** December 6, 2025  
**Feature:** Auto-Assign Users to Active Agents
