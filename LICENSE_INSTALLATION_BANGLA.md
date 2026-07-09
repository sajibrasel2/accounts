# 🔑 লাইসেন্স কী ইনস্টলেশন গাইড (বাংলায়)

---

## ✅ আপনি লাইসেন্স কী পেয়েছেন? এখন কি করবেন?

যখন আপনি **Sajib Digital Hub** থেকে লাইসেন্স কী পাবেন, তখন এরকম একটা মেসেজ পাবেন:

```
🎉 লাইসেন্স সফল! POS System আনলক হয়েছে!

━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 আপনার লাইসেন্স তথ্য:
━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 ক্লায়েন্ট: রাসেল সাহেব
🔑 License Key: SAJIB-ABC12345-XYZ67890
📅 মেয়াদ: 31 January 2025
📆 চলবে: 30 দিন

━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ ইনস্টলেশন নির্দেশনা:
━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ আপনার POS System folder খুলুন
2️⃣ .env ফাইল খুজুন
3️⃣ নিচের 3টি line পরিবর্তন করুন:

LICENSE_CLIENT_NAME=রাসেল সাহেব
LICENSE_KEY=SAJIB-ABC12345-XYZ67890
LICENSE_EXPIRY=2025-01-31

4️⃣ File Save করুন (Ctrl+S)
5️⃣ Server restart করুন

━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Sajib Digital Hub
📱 01739354392 | @sajibrasel2
━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📂 স্টেপ বাই স্টেপ গাইড

### ধাপ ১: POS System Folder খুলুন

প্রথমে আপনার কম্পিউটারে যেখানে POS System install করেছেন, সেই folder খুলুন।

উদাহরণ:
```
C:\Users\YourName\Desktop\POS-System\
```

অথবা

```
D:\Projects\billing-system\
```

---

### ধাপ ২: `.env` ফাইল খুঁজে বের করুন

Folder এর মধ্যে **`.env`** নামে একটি ফাইল খুঁজুন।

**⚠️ মনে রাখবেন:**
- এই ফাইলটি লুকানো থাকতে পারে
- Windows এ hidden files দেখতে: View → Show → Hidden items চেক করুন
- ফাইলের নাম শুধু **`.env`** হবে (কোন `.txt` বা extension নেই)

---

### ধাপ ৩: `.env` ফাইল Open করুন

ফাইলটি **Notepad**, **Notepad++**, অথবা **VS Code** দিয়ে খুলুন।

ফাইলের মধ্যে এরকম দেখবেন:

```env
# ═══════════════════════════════════════════════════════════
# LICENSE CONFIGURATION (Client এখানে license update করবে)
# ═══════════════════════════════════════════════════════════

LICENSE_CLIENT_NAME=Demo User
LICENSE_KEY=DEMO-KEY-EXPIRES-SOON
LICENSE_EXPIRY=2025-01-31
```

---

### ধাপ ৪: লাইসেন্স তথ্য আপডেট করুন

আপনার মেসেজ থেকে তথ্যগুলো কপি করে **`.env`** ফাইলে paste করুন।

**Before (পুরাতন):**
```env
LICENSE_CLIENT_NAME=Demo User
LICENSE_KEY=DEMO-KEY-EXPIRES-SOON
LICENSE_EXPIRY=2025-01-31
```

**After (নতুন):**
```env
LICENSE_CLIENT_NAME=রাসেল সাহেব
LICENSE_KEY=SAJIB-ABC12345-XYZ67890
LICENSE_EXPIRY=2025-01-31
```

**⚠️ সতর্কতা:**
- `=` চিহ্নের আগে-পরে কোন space দিবেন না
- লাইসেন্স কী এর spelling হুবহু মিলাতে হবে (ছোট-বড় হাতের পার্থক্য আছে)
- তারিখ **YYYY-MM-DD** format এ দিতে হবে (যেমন: 2025-01-31)

---

### ধাপ ৫: ফাইল Save করুন

- **Notepad**: File → Save (অথবা Ctrl+S)
- **Notepad++**: File → Save (অথবা Ctrl+S)
- **VS Code**: File → Save (অথবা Ctrl+S)

---

### ধাপ ৬: Server Restart করুন

লাইসেন্স কী activate করতে server restart করতে হবে।

#### Windows (XAMPP ব্যবহার করলে):

1. **Command Prompt বা PowerShell খুলুন**
2. POS System folder এ যান:
   ```bash
   cd C:\Users\YourName\Desktop\POS-System
   ```
3. চলমান server বন্ধ করুন: **Ctrl+C** চাপুন
4. নতুন করে start করুন:
   ```bash
   node server.js
   ```

#### অথবা

যদি server চালু না থাকে, সরাসরি start করুন:
```bash
npm start
```

---

### ধাপ ৭: যাচাই করুন (Verify)

Server চালু হলে terminal এ দেখবেন:

✅ **সফল হলে:**
```
✅ LICENSE VALID
   Client: রাসেল সাহেব
   Expires: 31 January 2025 (30 days left)
```

❌ **ভুল হলে:**
```
❌ LICENSE INVALID or EXPIRED
   System locked. Contact: 01739354392
```

এখন browser এ যান: **http://localhost:3000**

System পুরোপুরি unlock হয়ে যাবে! ✨

---

## 🛠️ সমস্যা সমাধান (Troubleshooting)

### সমস্যা ১: "LICENSE INVALID" বলছে

**কারণ:**
- লাইসেন্স কী ভুল লিখেছেন
- তারিখ ভুল format এ দিয়েছেন
- `=` এর আগে-পরে space আছে

**সমাধান:**
1. `.env` ফাইল আবার খুলুন
2. মেসেজ থেকে হুবহু copy-paste করুন
3. কোন extra space বা enter দিবেন না
4. Save করে server restart করুন

---

### সমস্যা ২: `.env` ফাইল খুঁজে পাচ্ছি না

**সমাধান:**
1. Windows File Explorer খুলুন
2. View → Show → **Hidden items** চেক করুন
3. `.env` ফাইল এখন দেখা যাবে

অথবা নতুন করে তৈরি করুন:
1. Notepad খুলুন
2. উপরের template টি paste করুন
3. File → Save As
4. **File name:** `.env` (ডট সহ)
5. **Save as type:** All Files
6. POS System folder এ save করুন

---

### সমস্যা ৩: Server restart করতে পারছি না

**সমাধান:**
1. Command Prompt বা PowerShell খুলুন
2. Task Manager খুলুন (Ctrl+Shift+Esc)
3. **Node.js** খুঁজে **End Task** করুন
4. Command Prompt এ আবার `node server.js` চালান

---

## 📞 সাহায্য প্রয়োজন?

যদি কোন সমস্যা হয়, যোগাযোগ করুন:

**📱 WhatsApp:** 01739354392  
**💬 Facebook:** fb.com/sajibrasel2  
**📧 Email:** raselsajib25@gmail.com  

**⏰ উত্তর পাবেন:**
- সকাল ৯টা - রাত ১০টা
- ৭ দিন সপ্তাহে

---

## 🔄 লাইসেন্স Renewal (নবায়ন)

মেয়াদ শেষ হওয়ার আগে **7 দিন** warning পাবেন।

**Renewal করতে:**
1. **01739354392** এ WhatsApp করুন
2. আপনার নাম এবং পুরাতন লাইসেন্স কী দিন
3. Payment করুন (bKash/Nagad/Rocket)
4. নতুন লাইসেন্স কী পাবেন
5. `.env` ফাইলে update করুন

**💰 Renewal Price:**
- 1 মাস: ৳500
- 3 মাস: ৳1,200 (সাশ্রয় ৳300)
- 6 মাস: ৳2,000 (সাশ্রয় ৳1,000)
- 1 বছর: ৳3,000 (সাশ্রয় ৳3,000)

---

## ✅ সফল ইনস্টলেশন চেকলিস্ট

নিশ্চিত করুন:

- [ ] `.env` ফাইল খুঁজে পেয়েছেন
- [ ] লাইসেন্স তথ্য সঠিকভাবে paste করেছেন
- [ ] কোন extra space নেই
- [ ] তারিখ YYYY-MM-DD format এ আছে
- [ ] ফাইল save করেছেন (Ctrl+S)
- [ ] Server restart করেছেন
- [ ] Terminal এ "LICENSE VALID" দেখাচ্ছে
- [ ] Browser এ system খুলছে

সবগুলো ✅ হলে আপনি সফল! 🎉

---

**✨ Sajib Digital Hub ✨**  
*Making business easy with technology*

📱 01739354392 | @sajibrasel2  
📧 raselsajib25@gmail.com  

© 2024-2026 All Rights Reserved  
Made with ❤️ in Bangladesh 🇧🇩
