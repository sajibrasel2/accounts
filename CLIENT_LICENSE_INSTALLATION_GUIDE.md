# 📋 Client License Installation Guide

## ক্লায়েন্টের জন্য License Activation গাইড

---

## 🎯 আপনি Client কে যা পাঠাবেন:

### WhatsApp/Facebook Message Format:

```
আসসালামু আলাইকুম [Client Name],

আপনার POS Software এর License তৈরি হয়েছে।

📋 License Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Client Name: রাসেল সাহেব
License Key: SAJIB-ABC123-XYZ789
Expiry Date: 31/01/2025
━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 License Activate করার নিয়ম:

১. Software folder খুলুন
২. .env নামের file খুঁজুন
৩. Notepad দিয়ে খুলুন
৪. নিচের ৩টি line যোগ করুন:

LICENSE_CLIENT_NAME=রাসেল সাহেব
LICENSE_KEY=SAJIB-ABC123-XYZ789
LICENSE_EXPIRY=2025-01-31

৫. Save করুন (Ctrl+S)
৬. Server restart করুন

✅ License activate হবে!

যেকোনো সমস্যায় যোগাযোগ করুন:
📱 WhatsApp: 01739354392
💬 Facebook: @sajibrasel2

ধন্যবাদ,
Sajib Digital Hub
```

---

## 📸 Step-by-Step Screenshots Guide:

### ধাপ ১: Software Folder খুলুন

```
📁 C:\xampp\htdocs\accounts\
```

এই folder এ যান যেখানে software install করা আছে।

---

### ধাপ ২: .env File খুঁজুন

Folder এ দেখবেন:
```
📄 .env
📄 server.js
📄 package.json
📁 public
📁 node_modules
```

**`.env` file** খুঁজে বের করুন।

---

### ধাপ ৩: .env File Open করুন

**Right Click** করুন → **"Open with Notepad"** select করুন

অথবা

**Notepad** খুলে **File → Open** → `.env` select করুন

---

### ধাপ ৪: License Lines যোগ করুন

.env file এ আগে থেকে এরকম কিছু লেখা থাকবে:

```env
# Server Configuration
PORT=3000

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=local_billing_db

# License Configuration (এখানে যোগ করুন)
LICENSE_CLIENT_NAME=Demo User
LICENSE_KEY=DEMO-KEY-EXPIRES-SOON
LICENSE_EXPIRY=2025-01-31
```

**পুরাতন license lines মুছে দিয়ে নতুন license বসান:**

```env
# License Configuration
LICENSE_CLIENT_NAME=রাসেল সাহেব
LICENSE_KEY=SAJIB-ABC123-XYZ789
LICENSE_EXPIRY=2025-01-31
```

---

### ধাপ ৫: Save করুন

**File → Save** (অথবা Ctrl+S চাপুন)

---

### ধাপ ৬: Server Restart করুন

**Command Prompt/Terminal এ:**

```bash
# পুরাতন server বন্ধ করুন (Ctrl+C চাপুন)

# নতুন করে চালু করুন
npm start
```

**Output দেখবেন:**

```
🚀 Server is running on http://localhost:3000
✅ License: Active
📅 Expires: 31/01/2025
```

---

## ✅ License Activate হয়েছে কিনা Check করুন:

### Browser এ খুলুন:
```
http://localhost:3000
```

### নিচে Footer দেখুন:

যদি license সঠিক থাকে:
```
✅ License Active
Expires: 31 January 2025
Contact: 01739354392
```

যদি license expire হয়ে যায়:
```
⚠️ License Expired!
Renew now: 01739354392
```

---

## 🎥 Video Tutorial Link (Future):

আপনি চাইলে একটা short video বানাতে পারেন:

**Topics:**
1. .env file কোথায়
2. কিভাবে খুলবে
3. License lines কিভাবে paste করবে
4. Save করবে
5. Server restart করবে

**Duration:** 2-3 minutes

**Upload:** YouTube → Link পাঠাবেন

---

## 📝 .env File Example (Complete):

```env
# Server Configuration
PORT=3000

# MySQL Database Configuration (XAMPP defaults)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=local_billing_db

# Application Settings
NODE_ENV=development

# License Configuration (Client এখানে update করবে)
LICENSE_CLIENT_NAME=রাসেল সাহেব
LICENSE_KEY=SAJIB-ABC123-XYZ789
LICENSE_EXPIRY=2025-01-31

# Developer Contact
DEVELOPER_NAME=Sajib Digital Hub
DEVELOPER_PHONE=01739354392
DEVELOPER_FACEBOOK=@sajibrasel2
```

---

## ❓ Common Problems & Solutions:

### Problem 1: ".env file পাচ্ছি না"

**Solution:**
- Hidden files show করুন:
  - File Explorer → View → Hidden items ✓ check করুন
- অথবা Search করুন: `.env`

---

### Problem 2: "License activate হচ্ছে না"

**Solution:**
- Check করুন:
  - ✓ 3টি line সঠিকভাবে paste করেছেন কিনা
  - ✓ কোনো extra space নেই
  - ✓ = চিহ্ন ঠিক আছে
  - ✓ Save করেছেন কিনা
  - ✓ Server restart করেছেন কিনা

---

### Problem 3: "Server চালু হচ্ছে না"

**Solution:**
```bash
# XAMPP MySQL চালু করুন
# তারপর
npm start
```

---

### Problem 4: "License expired দেখাচ্ছে"

**Solution:**
- Expiry date check করুন
- আজকের date < expiry date হতে হবে
- Renewal করতে যোগাযোগ করুন: 01739354392

---

## 🔄 License Renewal Process:

### Client যখন renew করতে চাইবে:

**Message পাঠাবে:**
```
আসসালামু আলাইকুম,
আমার POS license renew করতে চাই।

Client Name: রাসেল সাহেব
Current License: SAJIB-ABC123-XYZ789
```

**আপনি নতুন license generate করবেন:**
```
New License Key: SAJIB-DEF456-PQR123
New Expiry: 28/02/2025
```

**Client update করবে:**
```
.env file এ শুধু এই 2টা line বদলাবে:

LICENSE_KEY=SAJIB-DEF456-PQR123
LICENSE_EXPIRY=2025-02-28
```

**Server restart করবে - Done!** ✅

---

## 📱 Remote Support (যদি Client না পারে):

### Option 1: TeamViewer
- আপনি remote access নিয়ে
- নিজেই .env file update করে দেবেন

### Option 2: AnyDesk
- Same as TeamViewer

### Option 3: WhatsApp Video Call
- Video call দিয়ে step-by-step বলে দেবেন

---

## 💡 Client Training Checklist:

যখন software deliver করবেন, client কে শেখাবেন:

```
☐ .env file কোথায়
☐ কিভাবে খুলবে
☐ License lines কোথায় paste করবে
☐ Save করার নিয়ম
☐ Server restart করার নিয়ম
☐ License check করার নিয়ম
☐ Renewal process
☐ Your contact number
```

---

## 🎯 Quick Reference Card (Client কে দিন):

```
╔════════════════════════════════════════╗
║   POS License Quick Reference          ║
╠════════════════════════════════════════╣
║                                        ║
║ 📁 File: .env                          ║
║ 📝 Editor: Notepad                     ║
║                                        ║
║ 🔑 License Lines (3):                  ║
║   - LICENSE_CLIENT_NAME=...            ║
║   - LICENSE_KEY=...                    ║
║   - LICENSE_EXPIRY=...                 ║
║                                        ║
║ 💾 Save: Ctrl+S                        ║
║ 🔄 Restart: npm start                  ║
║                                        ║
║ 📞 Support:                            ║
║   WhatsApp: 01739354392                ║
║   Facebook: @sajibrasel2               ║
║                                        ║
╚════════════════════════════════════════╝
```

---

## 🎬 Installation Video Script:

```
[Opening]
"আসসালামু আলাইকুম! এই video তে দেখাবো কিভাবে 
POS Software license activate করবেন।"

[Step 1]
"প্রথমে software folder খুলুন।"
[Show folder]

[Step 2]
".env file খুঁজুন এবং Notepad দিয়ে খুলুন।"
[Show opening]

[Step 3]
"License Configuration section এ যান।"
[Scroll to section]

[Step 4]
"আপনার license information paste করুন।"
[Show pasting]

[Step 5]
"Save করুন Ctrl+S চেপে।"
[Show saving]

[Step 6]
"Server restart করুন terminal এ npm start লিখে।"
[Show restart]

[Closing]
"ব্যস! License activate হয়ে গেছে। 
কোনো সমস্যা হলে 01739354392 এ যোগাযোগ করুন।"
```

---

## 📧 Email Template (Professional Clients):

```
Subject: Your POS Software License

Dear [Client Name],

Thank you for purchasing our POS Billing System.

Your License Details:
━━━━━━━━━━━━━━━━━━━━━━
Client Name: [Name]
License Key: SAJIB-XXXXX-XXXXX
Expiry Date: DD/MM/YYYY
━━━━━━━━━━━━━━━━━━━━━━

Installation Steps:
1. Open software folder
2. Find .env file
3. Open with Notepad
4. Add these lines:

LICENSE_CLIENT_NAME=[Name]
LICENSE_KEY=SAJIB-XXXXX-XXXXX
LICENSE_EXPIRY=YYYY-MM-DD

5. Save file (Ctrl+S)
6. Restart server: npm start

Support:
- WhatsApp: 01739354392
- Facebook: @sajibrasel2
- Email: raselsajib25@gmail.com

Best regards,
Sajib Digital Hub
```

---

**এখন client সহজেই license activate করতে পারবে!** ✅

**Support: 01739354392** 📱
