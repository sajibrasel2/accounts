# 🚀 এখান থেকে শুরু করুন (Start Here)

## ⚡ দ্রুত শুরু (Quick Start)

### ১. XAMPP চালু করুন
- XAMPP Control Panel খুলুন
- **MySQL** এ START ক্লিক করুন
- সবুজ রঙ দেখলে ঠিক আছে

### ২. Migration চালান (প্রথমবার মাত্র)
```bash
node migrate_to_ledger.js
```

**দেখবেন:**
```
✅ Connected to database
✅ Added ledger columns
🎉 Migration completed successfully!
```

### ৩. Server চালু করুন
```bash
npm start
```

**দেখবেন:**
```
🚀 Server is running on http://localhost:3000
```

### ৪. Browser-এ খুলুন
```
http://localhost:3000
```

---

## 🎯 প্রথম বার ব্যবহার

### ক. WhatsApp সংযোগ করুন

1. **Admin Settings** tab-এ ক্লিক করুন
2. QR code দেখবেন
3. আপনার phone-এ WhatsApp খুলুন:
   - Settings → Linked Devices → Link a Device
4. QR scan করুন
5. ✅ "WhatsApp Connected" দেখলে ঠিক আছে

### খ. Business তথ্য দিন

Same tab এ:
- Business Name লিখুন (e.g., "Sajib Digital hub")
- Phone Number লিখুন (optional)
- Footer Message লিখুন
- **Save Settings** ক্লিক করুন

### গ. প্রথম Client যোগ করুন

1. **Clients** tab-এ যান
2. Client Name: যেমন "রাসেল আহমেদ"
3. Phone: 01712345678
4. **Add Client** ক্লিক করুন

---

## 💰 বিল তৈরি করুন

### ১. Create Bill tab-এ যান

### ২. Client select করুন
- Dropdown থেকে client বেছে নিন
- পূর্বের বকেয়া দেখবেন (নতুন client এর ৳0)

### ৩. Items যোগ করুন
- Item name: Typing
- Quantity: 5
- Rate: 10
- আরও item যোগ করতে **Add Item** ক্লিক করুন

### ৪. জমা প্রদান লিখুন
- যত টাকা payment নিয়েছেন: যেমন 40

### ৫. Summary check করুন
- মোট বিল দেখবেন
- বকেয়া দেখবেন
- সব ঠিক থাকলে **"জেনারেট করুন"** ক্লিক করুন

### ৬. WhatsApp পাঠান
- Bill generate হলে **"WhatsApp পাঠান"** button enable হবে
- Click করলে client এর phone-এ message যাবে

### ৭. প্রিন্ট করুন (optional)
- **"প্রিন্ট করুন"** ক্লিক করুন
- PDF save বা print করুন

---

## ✏️ বিল সংশোধন করুন (নতুন!)

### যদি ভুল বিল তৈরি করে ফেলেন:

1. **Dashboard** tab-এ যান
2. Recent Transactions টেবিলে সেই বিল খুঁজুন
3. **নীল Edit আইকন (🖊️)** ক্লিক করুন
4. Edit Modal খুলবে:
   - Item পরিবর্তন করুন
   - Quantity/Rate বদলান
   - জমা প্রদান বদলান
   - নতুন মোট বকেয়া দেখবেন
5. **"সংশোধন সেভ করুন"** ক্লিক করুন
6. ✅ বিল update হবে, client balance ঠিক হবে

### আবার WhatsApp পাঠাতে:

1. Same বিলের **সবুজ WhatsApp আইকন (📱)** ক্লিক করুন
2. Confirm করুন
3. ✅ সংশোধিত বিল আবার পাঠানো হবে

---

## 📊 Dashboard

**Dashboard** tab-এ দেখবেন:

### উপরে Card গুলো:
- **Total Revenue** - সব বিল এর যোগফল
- **Total Clients** - কতজন customer
- **Total Bills** - কতগুলো বিল

### নিচে Recent Transactions:
প্রতিটি বিলের সাথে তিনটা button:
- 🖊️ **Edit** - বিল সংশোধন
- 📱 **Resend** - আবার WhatsApp পাঠান
- 🖨️ **Print** - প্রিন্ট করুন

---

## 🔧 Settings

### Business Profile আপডেট:
- **Admin Settings** → Business Profile section
- Name, Phone, Address, Footer লিখুন
- Save করুন

### WhatsApp Status:
- Same tab এ Connection status দেখুন
- Disconnected থাকলে QR scan করুন

---

## 📱 WhatsApp Message কেমন যাবে?

```
╔════════════════════════════╗
║  🏢 *Sajib Digital hub*
║  📞 01812345678
╚════════════════════════════╝

┌────────────────────────────┐
│ 👤 *ক্লায়েন্ট:* রাসেল আহমেদ
│ 📱 মোবাইল: 01712345678
│ 📅 তারিখ: ৯ জুলাই, ২০২৬
└────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ *বিবরণ*        *পরিমাণ  মূল্য*
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
1. Typing         5  ৳50.00
2. Photocopy     10  ৳20.00
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌────────────────────────────┐
│ মোট বিল:       ৳70.00
│ জমা প্রদান:     ৳40.00
│ *বর্তমান বকেয়া: ৳30.00*
└────────────────────────────┘

╔════════════════════════════╗
║ পূর্বের বকেয়া:  ৳0.00
║ ✨ *সর্বমোট বকেয়া:* ✨
║      *৳30.00*
╚════════════════════════════╝

💬 আবার আসবেন 🙏

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ❓ সমস্যা হলে

### Server চালু হচ্ছে না
```bash
# XAMPP MySQL চালু আছে check করুন
# তারপর আবার try করুন
npm start
```

### "Unknown column 'subtotal'" Error
```bash
# Migration চালান
node migrate_to_ledger.js
```

### WhatsApp connect হচ্ছে না
- Admin Settings → QR code scan করুন
- Phone এ WhatsApp → Settings → Linked Devices → Link a Device

### Edit button কাজ করছে না
- Browser refresh করুন (F5)
- Cache clear করুন (Ctrl + Shift + Delete)

---

## 📚 আরও বিস্তারিত

- **BILL_EDIT_GUIDE.md** - বিল সংশোধন এর সম্পূর্ণ গাইড
- **MANUAL_TEST_CHECKLIST.md** - ধাপে ধাপে test করার checklist
- **SETUP_AND_TEST_GUIDE.md** - Technical testing guide
- **README.md** - সব features এর বিবরণ

---

## 💡 Tips

1. **প্রথমে Test Client দিয়ে practice করুন**
   - ভুল করলেও সমস্যা নেই
   - Edit করে ঠিক করতে পারবেন

2. **WhatsApp একবার connect করলে থেকে যায়**
   - পরে আর QR scan লাগবে না

3. **Previous Due automatically calculate হয়**
   - নতুন বিল করলে পুরাতন বকেয়া দেখাবে
   - Client balance সবসময় updated থাকে

4. **Edit করলে balance automatic ঠিক হয়**
   - পুরাতন due বাদ যায়
   - নতুন due যোগ হয়

---

## ✅ Ready!

এখন আপনি:
- ✅ বিল তৈরি করতে পারবেন
- ✅ WhatsApp এ পাঠাতে পারবেন
- ✅ ভুল বিল সংশোধন করতে পারবেন
- ✅ আবার পাঠাতে পারবেন
- ✅ প্রিন্ট করতে পারবেন

**শুরু করুন!** 🎉

---

**Version:** 2.2.0  
**Language:** বাংলা (Bengali)  
**Support:** Check other MD files for detailed guides
