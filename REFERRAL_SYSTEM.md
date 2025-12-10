# 🎁 REFERRAL SYSTEM WITH AUTO-AGENT PROMOTION

**Feature:** Automatic Agent Promotion via Referral Codes  
**Status:** ✅ COMPLETE

---

## 📋 HOW IT WORKS

### **Scenario: Ramu refers Ravi**

1. **Ramu shares his referral code** with Ravi
2. **Ravi signs up** using Ramu's referral code
3. **System automatically:**
   - ✅ Promotes Ramu to **Agent** (if not already)
   - ✅ Creates referral code for Ramu (if doesn't have one)
   - ✅ Assigns Ravi to Ramu as his agent
   - ✅ Creates referral record

4. **In Admin Panel → Agent Management:**
   - Ramu appears as an agent
   - Ravi appears in Ramu's referral list

---

## 🎯 USER FLOW

### **Step 1: Ramu Gets a Referral Code**

**Option A: Admin Creates Ramu as Agent**
```
Admin Panel → User Management → Create User
├── Name: Ramu
├── Email: ramu@example.com
├── Role: Agent
└── Result: Ramu gets referral code (e.g., AGENTLX3K8A9B2)
```

**Option B: Ramu Signs Up Normally**
```
Ramu registers → Gets default referral code
(Will be promoted to agent when someone uses his code)
```

---

### **Step 2: Ramu Shares Code with Ravi**

Ramu shares his referral code:
```
"Hey Ravi, use my code: AGENTLX3K8A9B2 when you sign up!"
```

Or shares a link:
```
https://yoursite.com/register?ref=AGENTLX3K8A9B2
```

---

### **Step 3: Ravi Signs Up with Code**

**Ravi goes to registration page:**
```
/register
```

**Fills in the form:**
```
┌─────────────────────────────────┐
│ Create Account                  │
├─────────────────────────────────┤
│ Name: [Ravi                 ]   │
│ Email: [ravi@example.com    ]   │
│ Password: [••••••••         ]   │
│ Confirm: [••••••••          ]   │
│                                 │
│ 🎁 Referral Code (Optional)     │
│ [AGENTLX3K8A9B2            ]   │
│ Have a referral code? Enter it! │
│                                 │
│ [Register]                      │
└─────────────────────────────────┘
```

---

### **Step 4: Magic Happens! ✨**

**When Ravi clicks "Register":**

1. **User Account Created**
   - Ravi's account is created
   - Email: ravi@example.com
   - Role: user

2. **Referral Code Validated**
   - System finds AGENTLX3K8A9B2
   - Belongs to Ramu

3. **Ramu Promoted to Agent** (if not already)
   - Ramu's role: user → **agent**
   - Ramu gets referral code (if didn't have one)
   - Ramu can now be seen in Agent Management

4. **Ravi Assigned to Ramu**
   - Ravi's `agentId` = Ramu's user ID
   - Ravi is now under Ramu's management

5. **Referral Record Created**
   - Referrer: Ramu
   - Referred: Ravi
   - Status: completed
   - Reward: 100 coins (default)

---

## 📊 ADMIN PANEL VIEW

### **Agent Management Section**

**Before Ravi signs up:**
```
Agents (0)
└── No agents yet
```

**After Ravi signs up with Ramu's code:**
```
Agents (1)
└── Ramu (ramu@example.com)
    ├── Referral Code: AGENTLX3K8A9B2
    ├── Total Referrals: 1
    ├── Total Rewards: $100
    └── Referred Users:
        └── Ravi (ravi@example.com)
            ├── Joined: Dec 5, 2025
            ├── Status: Active
            └── Reward: $100
```

---

## 🔧 TECHNICAL IMPLEMENTATION

### **Files Modified/Created:**

#### **1. Registration Page**
**File:** `src/app/register/page.tsx`

**Changes:**
- ✅ Added `referralCode` state
- ✅ Added referral code input field
- ✅ Supports URL parameter `?ref=CODE`
- ✅ Calls `/api/referral/apply` after signup

**Features:**
```typescript
// Get referral code from URL
const searchParams = useSearchParams();
const [referralCode, setReferralCode] = useState(
  searchParams?.get("ref") || ""
);

// Apply referral after signup
if (referralCode && referralCode.trim() !== '') {
  await fetch('/api/referral/apply', {
    method: 'POST',
    body: JSON.stringify({ referralCode }),
  });
}
```

---

#### **2. Referral API Endpoint**
**File:** `src/app/api/referral/apply/route.ts`

**Features:**
- ✅ Validates referral code
- ✅ Prevents self-referral
- ✅ Prevents duplicate referrals
- ✅ **Automatically promotes referrer to agent**
- ✅ Creates referral code for new agent
- ✅ Assigns user to agent
- ✅ Creates referral record

**Logic Flow:**
```typescript
1. Get current user from session
2. Validate referral code exists
3. Check referrer's role
4. IF referrer is NOT agent:
   ├── Promote to agent
   └── Create referral code
5. Assign current user to agent
6. Create referral record
7. Return success
```

---

## 💡 EXAMPLE SCENARIOS

### **Scenario 1: First Referral**

**Initial State:**
- Ramu: Regular user (role = 'user')
- Ravi: Not registered

**Action:**
- Ravi signs up with Ramu's code

**Result:**
- ✅ Ramu: Promoted to agent (role = 'agent')
- ✅ Ramu: Gets referral code
- ✅ Ravi: Assigned to Ramu
- ✅ Referral record created

---

### **Scenario 2: Existing Agent**

**Initial State:**
- Ramu: Already an agent (role = 'agent')
- Sita: Not registered

**Action:**
- Sita signs up with Ramu's code

**Result:**
- ✅ Ramu: Stays as agent (no promotion needed)
- ✅ Sita: Assigned to Ramu
- ✅ Referral record created
- ✅ Ramu's referral count increases

---

### **Scenario 3: Multiple Referrals**

**Initial State:**
- Ramu: Agent with 1 referral (Ravi)

**Action:**
- Krishna signs up with Ramu's code
- Lakshmi signs up with Ramu's code

**Result:**
```
Ramu (Agent)
├── Ravi (referred)
├── Krishna (referred)
└── Lakshmi (referred)

Total Referrals: 3
Total Rewards: $300
```

---

## 🎨 UI FEATURES

### **Registration Page:**

**Referral Code Field:**
- 🎁 Gift icon
- Optional label
- Auto-uppercase input
- Helper text
- URL parameter support

**Example:**
```
🎁 Referral Code (Optional)
[AGENTLX3K8A9B2]
Have a referral code? Enter it to get assigned to an agent!
```

---

### **Agent Management:**

**Agent Details Dialog:**
```
┌─────────────────────────────────┐
│ Agent Details: Ramu             │
├─────────────────────────────────┤
│ Referral Code: AGENTLX3K8A9B2   │
│ Total Referrals: 3              │
│ Total Rewards: $300             │
│                                 │
│ Referred Users:                 │
│ ┌─────────────────────────────┐ │
│ │ Name    │ Joined  │ Reward  ││
│ ├─────────┼─────────┼─────────┤│
│ │ Ravi    │ Dec 5   │ $100    ││
│ │ Krishna │ Dec 6   │ $100    ││
│ │ Lakshmi │ Dec 7   │ $100    ││
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## 🔍 DATABASE STRUCTURE

### **Tables Used:**

#### **1. referralCodes**
```sql
CREATE TABLE referral_codes (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);
```

#### **2. referrals**
```sql
CREATE TABLE referrals (
  id INTEGER PRIMARY KEY,
  referrer_user_id TEXT NOT NULL,  -- Ramu
  referred_user_id TEXT NOT NULL,  -- Ravi
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  reward_amount REAL NOT NULL DEFAULT 100,
  created_at TEXT NOT NULL,
  completed_at TEXT
);
```

#### **3. user_balances**
```sql
CREATE TABLE user_balances (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  coins INTEGER NOT NULL DEFAULT 0,
  role TEXT NOT NULL DEFAULT 'user',
  agent_id TEXT,  -- Points to Ramu's user_id
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

---

## 📈 QUERIES

### **Get Agent's Referrals:**
```sql
SELECT 
  u.id,
  u.name,
  u.email,
  r.reward_amount,
  r.created_at as joined_at,
  ub.role,
  ub.coins
FROM referrals r
JOIN user u ON r.referred_user_id = u.id
JOIN user_balances ub ON u.id = ub.user_id
WHERE r.referrer_user_id = 'ramu_user_id'
ORDER BY r.created_at DESC;
```

### **Get User's Agent:**
```sql
SELECT 
  a.id,
  a.name,
  a.email,
  rc.referral_code
FROM user_balances ub
JOIN user a ON ub.agent_id = a.id
LEFT JOIN referral_codes rc ON a.id = rc.user_id
WHERE ub.user_id = 'ravi_user_id';
```

### **Count Agents:**
```sql
SELECT COUNT(*) as total_agents
FROM user_balances
WHERE role = 'agent';
```

---

## ✅ TESTING CHECKLIST

### **Test 1: New User with Referral Code**
- [ ] Register new user with valid referral code
- [ ] Check referrer is promoted to agent
- [ ] Check user is assigned to agent
- [ ] Check referral record is created
- [ ] Check agent appears in Agent Management

### **Test 2: Existing Agent Referral**
- [ ] Register new user with existing agent's code
- [ ] Check agent is NOT promoted again
- [ ] Check user is assigned to agent
- [ ] Check referral count increases

### **Test 3: Invalid Referral Code**
- [ ] Register with invalid code
- [ ] Check registration still succeeds
- [ ] Check user is NOT assigned to any agent
- [ ] Check warning in console

### **Test 4: Self-Referral Prevention**
- [ ] Try to use own referral code
- [ ] Check error is returned
- [ ] Check no referral is created

### **Test 5: Duplicate Referral Prevention**
- [ ] User already has a referral
- [ ] Try to use another code
- [ ] Check error is returned

---

## 🎉 BENEFITS

### **For Users:**
- ✅ Easy to use referral system
- ✅ Get assigned to an agent automatically
- ✅ Support from their agent

### **For Referrers:**
- ✅ Automatic promotion to agent
- ✅ Get referral code automatically
- ✅ Track all referrals
- ✅ Earn rewards

### **For Admins:**
- ✅ Automatic agent management
- ✅ Track all referrals
- ✅ See agent performance
- ✅ No manual promotion needed

---

## 🚀 FUTURE ENHANCEMENTS

### **Planned Features:**
1. **Referral Rewards**
   - Automatic coin rewards
   - Commission system
   - Tiered rewards

2. **Agent Dashboard**
   - Agents can view their referrals
   - Track earnings
   - Download reports

3. **Referral Analytics**
   - Conversion rates
   - Top performing agents
   - Referral trends

4. **Social Sharing**
   - Share referral link
   - Social media integration
   - QR code generation

---

## 📞 USAGE SUMMARY

**For Users:**
1. Get referral code from friend
2. Enter code during registration
3. Automatically assigned to agent

**For Agents:**
1. Share your referral code
2. When someone uses it, they become your referral
3. View your referrals in Agent Management

**For Admins:**
1. View all agents in Agent Management
2. See each agent's referrals
3. Track referral performance

---

**Status:** ✅ **FULLY FUNCTIONAL**  
**Last Updated:** December 5, 2025  
**Feature:** Automatic Agent Promotion via Referrals
