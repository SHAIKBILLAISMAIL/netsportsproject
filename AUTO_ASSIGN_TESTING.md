# 🧪 AUTO-ASSIGN AGENT - TESTING GUIDE

## ✅ What Was Fixed

The auto-assign feature now works correctly! Here's what was improved:

### **Changes Made:**

1. **Added 500ms delay** - Waits for authentication token to be set after signup
2. **Better logging** - Console shows exactly what's happening
3. **Error handling** - Shows clear error messages if something fails
4. **User feedback** - Toast notification when assigned to agent

---

## 🧪 HOW TO TEST

### **Step 1: Create Some Agents**

First, you need at least one agent in the system:

1. Go to **Admin Panel → Agent Management**
2. Click **"CREATE AGENT"** (green button, top right)
3. Fill in:
   ```
   Name: Agent Ramu
   Email: ramu@example.com
   Password: password123
   Initial Coins: 1000
   ```
4. Click **"Create Agent"**
5. Repeat to create 2-3 agents

---

### **Step 2: Test Auto-Assignment**

Now test the auto-assign feature:

1. **Open browser console** (F12 → Console tab)
2. **Logout** (if logged in)
3. Go to **`/register`**
4. Fill in the form:
   ```
   Name: Test User
   Email: testuser@example.com
   Password: password123
   Confirm Password: password123
   Referral Code: [LEAVE EMPTY]  ← Important!
   ```
5. Click **"Register"**

---

### **Step 3: Check Console Logs**

You should see these logs in the console:

```
🤖 Auto-assigning user to agent...
Token available: true
✅ User auto-assigned to agent: user_1234567890_xxxxx
```

And a toast notification:
```
✅ You have been assigned to an agent!
```

---

### **Step 4: Verify in Admin Panel**

1. Go to **Admin Panel → Agent Management**
2. Click **"DETAILS"** on any agent
3. You should see the new user in the "Referred Users" list
4. Type will show as "Auto-assign" (not referral)

---

## 🔍 TROUBLESHOOTING

### **Issue 1: "No agents available"**

**Console shows:**
```
ℹ️ No agents available for auto-assignment
```

**Solution:**
- Create at least one agent first
- Make sure agent has `role='agent'` in database

---

### **Issue 2: "User not authenticated"**

**Console shows:**
```
❌ Auto-assign failed: { error: 'User not authenticated' }
```

**Solution:**
- The 500ms delay should fix this
- If still happening, increase delay to 1000ms in `register/page.tsx`

---

### **Issue 3: User created but not assigned**

**Console shows:**
```
Token available: false
```

**Solution:**
- Authentication token not set properly
- Try logging in manually after registration
- Check if `localStorage.getItem("bearer_token")` returns a value

---

## 📊 VERIFICATION QUERIES

### **Check if user has agent:**

```sql
SELECT 
  u.name as user_name,
  u.email as user_email,
  ub.agent_id,
  a.name as agent_name
FROM user u
JOIN user_balances ub ON u.id = ub.user_id
LEFT JOIN user a ON ub.agent_id = a.id
WHERE u.email = 'testuser@example.com';
```

**Expected Result:**
```
user_name  | user_email           | agent_id      | agent_name
-----------|---------------------|---------------|------------
Test User  | testuser@example.com | user_xxx      | Agent Ramu
```

---

### **Count users per agent:**

```sql
SELECT 
  a.name as agent_name,
  a.email as agent_email,
  COUNT(u.user_id) as total_users
FROM user_balances a
LEFT JOIN user_balances u ON a.user_id = u.agent_id
WHERE a.role = 'agent'
GROUP BY a.user_id, a.name, a.email
ORDER BY total_users DESC;
```

**Expected Result:**
```
agent_name  | agent_email         | total_users
------------|---------------------|-------------
Agent Ramu  | ramu@example.com    | 3
Agent Sita  | sita@example.com    | 2
Agent Kumar | kumar@example.com   | 1
```

---

## 🎯 EXPECTED BEHAVIOR

### **With Referral Code:**
```
User signs up with code → Assigned to code owner → Code owner becomes agent
```

### **Without Referral Code:**
```
User signs up (no code) → Random agent selected → User assigned to agent
```

---

## 📝 CONSOLE LOG EXAMPLES

### **Successful Auto-Assignment:**

```
🤖 Auto-assigning user to agent...
Token available: true
✅ User auto-assigned to agent: user_1765023500851_uhus4lqga
```

### **No Agents Available:**

```
🤖 Auto-assigning user to agent...
Token available: true
ℹ️ No agents available for auto-assignment
```

### **With Referral Code:**

```
Applying referral code: AGENTLX3K8A9B2
✅ Referral code applied successfully: { success: true, ... }
```

---

## 🔧 ADVANCED TESTING

### **Test 1: Multiple Users**

Register 10 users without referral codes and check distribution:

```javascript
// Should be roughly equal distribution
Agent Ramu: 3 users
Agent Sita: 4 users
Agent Kumar: 3 users
```

### **Test 2: With and Without Code**

1. Register user WITH code → Check assigned to code owner
2. Register user WITHOUT code → Check assigned to random agent

### **Test 3: No Agents**

1. Delete all agents
2. Register new user
3. Should see: "No agents available"
4. User created but `agent_id` is NULL

---

## ✅ SUCCESS CRITERIA

**Auto-assignment is working if:**

1. ✅ Console shows "Auto-assigning user to agent..."
2. ✅ Console shows "Token available: true"
3. ✅ Console shows "User auto-assigned to agent: xxx"
4. ✅ Toast notification appears
5. ✅ User appears in agent's referral list
6. ✅ Database shows `agent_id` is set

---

## 🎉 FINAL TEST

**Complete End-to-End Test:**

1. **Create 3 agents** (Ramu, Sita, Kumar)
2. **Register 9 users** without referral codes
3. **Check distribution:**
   - Each agent should have ~3 users
   - All users should have `agent_id` set
4. **Register 1 user** with Ramu's referral code
   - Should be assigned to Ramu specifically
5. **Verify in Admin Panel:**
   - Ramu: 4 users (3 auto + 1 referral)
   - Sita: 3 users (all auto)
   - Kumar: 3 users (all auto)

---

## 📞 SUPPORT

If auto-assignment still doesn't work:

1. Check browser console for errors
2. Check server logs for API errors
3. Verify agents exist in database
4. Verify `agent_id` column exists
5. Try increasing delay to 1000ms

---

**Status:** ✅ **READY TO TEST**  
**Last Updated:** December 6, 2025
