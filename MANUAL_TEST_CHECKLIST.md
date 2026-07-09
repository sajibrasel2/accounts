# ✅ ম্যানুয়াল টেস্ট চেকলিস্ট (Manual Test Checklist)

এই checklist অনুসরণ করে নিজে test করুন এবং প্রতিটি ধাপ check করুন।

---

## 🚀 প্রথমে Setup করুন

### ধাপ 1: XAMPP চালু করুন
```
☐ XAMPP Control Panel খুলুন
☐ MySQL START ক্লিক করুন
☐ Apache START ক্লিক করুন (optional)
☐ MySQL এর পাশে সবুজ দেখান কিনা চেক করুন
```

### ধাপ 2: Migration চালান
```bash
node migrate_to_ledger.js
```

**Expected Output:**
```
☐ 🔄 Starting migration to Ledger System...
☐ ✅ Connected to database
☐ ✅ Added ledger columns
☐ 🎉 Migration completed successfully!
```

### ধাপ 3: Server চালান
```bash
npm start
```

**Expected Output:**
```
☐ ✅ Database 'local_billing_db' created/verified
☐ ✅ Table "clients" created/verified
☐ ✅ Table "transactions" created/verified
☐ ✅ Table "settings" created/verified
☐ ✅ Table "bill_items" created/verified
☐ 🎉 Database & Tables auto-configured successfully
☐ 🚀 Server is running on http://localhost:3000
```

---

## 🧪 Test 1: Basic Functionality Check

### Browser খুলুন: http://localhost:3000

```
☐ Dashboard tab দেখা যাচ্ছে
☐ Create Bill tab আছে
☐ Clients tab আছে
☐ Admin Settings tab আছে
☐ Header এ "POS Billing System" লেখা দেখা যাচ্ছে
☐ WhatsApp status দেখা যাচ্ছে (Checking... বা Disconnected)
```

---

## 🧪 Test 2: Add Client

### Clients Tab এ যান

```
☐ "Add New Client" form দেখা যাচ্ছে
☐ Client Name field আছে
☐ Phone Number field আছে
```

### একটা Test Client যোগ করুন:
- Name: `Test Client`
- Phone: `01712345678`

```
☐ "Add Client" button ক্লিক করলাম
☐ ✅ Success toast দেখা যাচ্ছে: "Client added successfully"
☐ Client টেবিলে নতুন client দেখা যাচ্ছে
☐ Balance: ৳0.00 দেখা যাচ্ছে
```

---

## 🧪 Test 3: Generate First Bill

### Create Bill Tab এ যান

```
☐ Client dropdown দেখা যাচ্ছে
☐ "Test Client" dropdown এ আছে
☐ Bill Items container খালি আছে
☐ "জমা প্রদান" input আছে (default: 0)
☐ Summary panel দেখা যাচ্ছে
```

### Bill তৈরি করুন:

1. **Client Select করুন:** Test Client
```
☐ Previous Due: ৳0.00 দেখাচ্ছে (নতুন client)
```

2. **Item 1 যোগ করুন:**
   - Item: `Typing`
   - Qty: `5`
   - Rate: `10`

3. **Item 2 যোগ করুন:**
   - Click "Add Item" button
   - Item: `Photocopy`
   - Qty: `10`
   - Rate: `2`

4. **জমা প্রদান:** `40`

```
☐ Subtotal: ৳70.00 দেখাচ্ছে
☐ জমা প্রদান: ৳40.00 দেখাচ্ছে
☐ বর্তমান বকেয়া: ৳30.00 দেখাচ্ছে
☐ পূর্বের বকেয়া: ৳0.00 দেখাচ্ছে
☐ সর্বমোট বকেয়া: ৳30.00 দেখাচ্ছে
```

5. **জেনারেট করুন button ক্লিক করুন**

```
☐ ✅ Success toast: "Bill generated successfully!"
☐ সবুজ info box দেখা যাচ্ছে: "Bill Generated Successfully!"
☐ Transaction ID দেখা যাচ্ছে (e.g., #1)
☐ "জেনারেট করুন" button disabled এবং "Generated" দেখাচ্ছে
☐ "WhatsApp পাঠান" button enabled হয়েছে
☐ "প্রিন্ট করুন" button enabled হয়েছে
```

---

## 🧪 Test 4: Check Dashboard

### Dashboard Tab এ যান

```
☐ Total Revenue: ৳70.00 (বা কাছাকাছি)
☐ Total Clients: 1
☐ Total Bills: 1
☐ Recent Transactions table এ 1টা entry
```

### Transaction Table চেক করুন:

```
☐ Client: Test Client
☐ Type: INCOME (সবুজ badge)
☐ Bill/Paid/Due:
  - মোট বিল: ৳70.00
  - জমা: ৳40.00
  - বকেয়া: ৳30.00
☐ Items: 2 item(s)
☐ WhatsApp Status: PENDING (ধূসর badge)
☐ Date: আজকের তারিখ
☐ Actions column এ তিনটা আইকন দেখা যাচ্ছে:
  ☐ 🖊️ নীল Edit icon
  ☐ 📱 সবুজ WhatsApp icon
  ☐ 🖨️ বেগুনি Print icon
```

---

## 🧪 Test 5: Edit Bill Feature ⭐ (নতুন!)

### Dashboard এ থাকুন

1. **Edit Icon (নীল 🖊️) ক্লিক করুন**

```
☐ Edit Bill Modal খুলেছে
☐ Title: "সংশোধন করুন (Edit Bill)"
☐ Client name দেখাচ্ছে: Test Client (read-only)
☐ পূর্বের বকেয়া: ৳0.00 দেখাচ্ছে (read-only)
☐ দুইটা item দেখাচ্ছে:
  ☐ Item 1: Typing, Qty: 5, Rate: 10
  ☐ Item 2: Photocopy, Qty: 10, Rate: 2
☐ জমা প্রদান: ৳40.00 দেখাচ্ছে
☐ নতুন মোট বকেয়া: ৳30.00 দেখাচ্ছে
```

2. **Item পরিবর্তন করুন:**
   - Typing এর Qty: `5` → `10` করুন

```
☐ নতুন মোট বকেয়া automatically update হলো
☐ এখন দেখাচ্ছে: ৳80.00 (70 → 120 bill, -40 paid = 80 due)
```

3. **জমা প্রদান পরিবর্তন করুন:**
   - জমা প্রদান: `40` → `60` করুন

```
☐ নতুন মোট বকেয়া আবার update হলো
☐ এখন দেখাচ্ছে: ৳60.00 (120 bill - 60 paid = 60 due)
```

4. **"সংশোধন সেভ করুন" ক্লিক করুন**

```
☐ ✅ Success toast: "বিল সংশোধন হয়েছে!" বা "Bill updated successfully"
☐ Modal বন্ধ হয়ে গেছে
☐ Dashboard reload হয়েছে
☐ Transaction table এ updated values দেখা যাচ্ছে:
  - মোট বিল: ৳120.00 (আগে ছিল ৳70.00)
  - জমা: ৳60.00 (আগে ছিল ৳40.00)
  - বকেয়া: ৳60.00 (আগে ছিল ৳30.00)
```

5. **Client Balance চেক করুন:**
   - Clients Tab এ যান

```
☐ Test Client এর Balance: ৳60.00 দেখাচ্ছে
☐ (আগে ছিল ৳30.00, এখন ৳60.00 - সঠিক!)
```

---

## 🧪 Test 6: Resend WhatsApp Feature ⭐ (নতুন!)

**Note:** এই test এর জন্য WhatsApp connected থাকতে হবে

### WhatsApp Connect করুন (যদি এখনও না করে থাকেন):

1. **Admin Settings Tab এ যান**

```
☐ WhatsApp Connection section দেখা যাচ্ছে
☐ QR code দেখা যাচ্ছে (যদি disconnected থাকে)
```

2. **QR Code scan করুন** (আপনার phone থেকে)
   - WhatsApp খুলুন → Settings → Linked Devices → Link a Device

```
☐ QR code scan করলাম
☐ "✅ WhatsApp Connected & Ready" দেখাচ্ছে
☐ Header এ "WhatsApp Connected" (সবুজ) দেখাচ্ছে
```

### Dashboard এ ফিরে যান

1. **WhatsApp Icon (সবুজ 📱) ক্লিক করুন**

```
☐ Confirmation dialog দেখা যাচ্ছে: "আবার WhatsApp পাঠাতে চান?"
```

2. **OK ক্লিক করুন**

```
☐ Button এ "Sending..." দেখাচ্ছে
☐ ২-৩ সেকেন্ড পর ✅ Success toast: "WhatsApp পাঠানো হয়েছে!"
☐ WhatsApp Status: SENT (সবুজ) হয়ে গেছে
```

3. **আপনার Phone চেক করুন** (01712345678)

```
☐ WhatsApp message এসেছে
☐ Business name দেখা যাচ্ছে
☐ Client name: Test Client
☐ Items list দেখা যাচ্ছে:
  - 1. Typing  10  ৳100.00
  - 2. Photocopy  10  ৳20.00
☐ মোট বিল: ৳120.00
☐ জমা প্রদান: ৳60.00
☐ বর্তমান বিলের বকেয়া: ৳60.00
☐ সর্বমোট বকেয়া: ৳60.00
```

---

## 🧪 Test 7: Print Feature

### Dashboard এ থাকুন

1. **Print Icon (বেগুনি 🖨️) ক্লিক করুন**

```
☐ Print dialog খুলেছে
☐ Receipt preview দেখা যাচ্ছে:
  ☐ Business Name
  ☐ Client info
  ☐ Items table
  ☐ Bill breakdown
  ☐ Ledger info (জমা, বকেয়া etc.)
```

2. **Print preview close করুন** (বা PDF save করুন)

```
☐ Dialog বন্ধ হয়ে গেছে
☐ Dashboard ঠিক আছে
```

---

## 🧪 Test 8: Create Second Bill (Previous Due Test)

### Create Bill Tab এ যান

1. **Same Client select করুন:** Test Client

```
☐ পূর্বের বকেয়া এখন দেখাচ্ছে: ৳60.00 (first bill থেকে)
```

2. **নতুন Item যোগ করুন:**
   - Item: `Legal Drafting`
   - Qty: `1`
   - Rate: `100`

3. **জমা প্রদান:** `50`

```
☐ মোট বিল: ৳100.00
☐ জমা প্রদান: ৳50.00
☐ বর্তমান বকেয়া: ৳50.00
☐ পূর্বের বকেয়া: ৳60.00
☐ সর্বমোট বকেয়া: ৳110.00 ✅ (60 + 50)
```

4. **জেনারেট করুন**

```
☐ Bill generated
```

5. **Clients Tab check করুন**

```
☐ Test Client Balance: ৳110.00 ✅
```

---

## 🧪 Test 9: Edit Second Bill and Check Balance Adjustment

### Dashboard এ যান

1. **Second bill (Legal Drafting) এর Edit icon ক্লিক করুন**

2. **জমা প্রদান পরিবর্তন করুন:**
   - জমা প্রদান: `50` → `80` করুন

```
☐ নতুন মোট বকেয়া: ৳80.00 (60 + 20)
```

3. **Save করুন**

```
☐ Updated successfully
```

4. **Clients Tab check করুন**

```
☐ Test Client Balance: ৳80.00 ✅
☐ Calculation: 110 (old total due) - 110 + 80 (new total due) = 80
```

---

## 🎯 সব কিছু ঠিক থাকলে Final Checklist:

```
☐ Migration run হয়েছে without errors
☐ Server চালু হয়েছে এবং database তৈরি হয়েছে
☐ Client add করতে পারছি
☐ Bill generate করতে পারছি
☐ Edit button কাজ করছে
☐ Edit modal সব data সঠিকভাবে দেখাচ্ছে
☐ Edit করে save করলে database update হচ্ছে
☐ Client balance automatically adjust হচ্ছে
☐ Resend WhatsApp button কাজ করছে
☐ WhatsApp message সঠিক format এ যাচ্ছে
☐ Print button কাজ করছে
☐ Previous Due carry forward হচ্ছে
☐ Dashboard analytics সঠিক
```

---

## ❌ যদি কোনো সমস্যা হয়:

### Error: "Unknown column 'subtotal'"
**Solution:** Migration run করুন:
```bash
node migrate_to_ledger.js
```

### Error: Edit modal খুলছে না
**Solution:** 
1. Browser console চেক করুন (F12)
2. `openEditBillModal` function আছে কিনা check করুন
3. Browser cache clear করুন (Ctrl+Shift+Delete)

### Error: Balance ভুল দেখাচ্ছে
**Solution:**
1. Dashboard reload করুন (F5)
2. Clients tab এ balance check করুন
3. Database এ সরাসরি check করুন (phpMyAdmin)

### Error: WhatsApp send হচ্ছে না
**Solution:**
1. Admin Settings → WhatsApp status "Connected" আছে কিনা
2. QR scan করুন আবার
3. Server restart করুন

---

## 📸 স্ক্রিনশট নিন (প্রমাণ হিসেবে):

```
☐ Dashboard এর screenshot
☐ Edit Modal এর screenshot
☐ WhatsApp message এর screenshot
☐ Client balance এর screenshot
```

---

**সব test pass হলে আপনার system সম্পূর্ণভাবে কাজ করছে!** ✅🎉

**Version:** 2.2.0  
**Test Date:** _________  
**Tested By:** _________  
**Result:** ☐ PASS ☐ FAIL
