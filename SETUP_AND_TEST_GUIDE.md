# 🚀 Complete Setup & Testing Guide

## ⚠️ IMPORTANT: Run Migration First!

Before starting the server, you **MUST** run the database migration to add the ledger system columns.

### Step 1: Run Database Migration

```bash
node migrate_to_ledger.js
```

**Expected Output:**
```
🔄 Starting migration to Ledger System...
✅ Connected to database
📊 Migrating transactions table...
✅ Added ledger columns
🎉 Migration completed successfully!
```

---

## 📦 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

Edit `.env` if you need custom settings:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=local_billing_db
PORT=3000
```

### 3. Start the Server

```bash
npm start
```

or

```bash
node server.js
```

**Expected Output:**
```
🔄 Starting automatic database configuration...
✅ Connected to MySQL server
✅ Database 'local_billing_db' created/verified
✅ Table "clients" created/verified
✅ Table "transactions" created/verified
✅ Table "settings" created/verified
✅ Table "bill_items" created/verified
🎉 Database & Tables auto-configured successfully

🔄 Initializing WhatsApp client...

📱 Scan this QR code with WhatsApp on your phone:
[QR CODE APPEARS HERE]

🚀 Server is running on http://localhost:3000
📊 Dashboard: http://localhost:3000
```

---

## 📱 WhatsApp Setup

### Option 1: Scan QR in Terminal
1. When the server starts, a QR code appears in the terminal
2. Open WhatsApp on your phone
3. Go to **Settings → Linked Devices**
4. Click **"Link a Device"**
5. Scan the QR code

### Option 2: Scan QR in Web UI
1. Open your browser: `http://localhost:3000`
2. Click the **"Admin Settings"** tab
3. The QR code will be displayed under **"WhatsApp Connection"**
4. Follow the same steps as Option 1

**Note:** Once authenticated, the session is saved locally in `.wwebjs_auth/` folder. You won't need to scan again unless you log out.

---

## ✅ Testing the Complete Workflow

### Test 1: Add a Client

1. Open `http://localhost:3000`
2. Go to **"Clients"** tab
3. Fill in:
   - **Client Name:** Test Client 1
   - **Phone Number:** 01712345678
4. Click **"Add Client"**
5. **Expected Result:** ✅ Success toast, client appears in table

---

### Test 2: Generate Bill (Step 1 of 3)

1. Go to **"Create Bill"** tab
2. Select **"Test Client 1"** from dropdown
3. **Verify:** Previous Due should show (৳0.00 for new client)
4. Add items:
   - Item 1: Typing, Qty: 5, Rate: 10
   - Item 2: Photocopy, Qty: 10, Rate: 2
5. Set **জমা প্রদান (Paid Amount):** 40
6. **Verify Summary Panel:**
   - মোট বিল (Subtotal): ৳70.00
   - জমা প্রদান (Paid): ৳40.00
   - বর্তমান বকেয়া (Current Due): ৳30.00
   - পূর্বের বকেয়া (Previous Due): ৳0.00
   - সর্বমোট বকেয়া (Total Due): ৳30.00
7. Click **"জেনারেট করুন"** button
8. **Expected Result:**
   - ✅ Success toast: "Bill generated successfully!"
   - Green info box appears with Transaction ID
   - **"জেনারেট করুন"** button becomes disabled and shows "Generated"
   - **"WhatsApp পাঠান"** button becomes enabled
   - **"প্রিন্ট করুন"** button becomes enabled

---

### Test 3: Send WhatsApp (Step 2 of 3)

1. **Pre-check:** Ensure WhatsApp status shows "Connected" in header
2. Click **"WhatsApp পাঠান"** button
3. **Expected Result:**
   - Button shows "Sending..." with spinner
   - After 2-3 seconds: ✅ Success toast "Bill sent via WhatsApp successfully!"
   - Button changes to "Sent" with checkmark
   - Check your WhatsApp: Message should arrive on the client's number

**Expected WhatsApp Message Format:**
```
============================
🏢 Sajib Digital hub
📞 [Your Business Phone]
============================

👤 ক্লায়েন্ট: Test Client 1
📱 মোবাইল: 01712345678
📅 তারিখ: [Bengali Date]

----------------------------
বিবরণ            পরিমাণ   মূল্য
1. Typing       5    ৳50.00
2. Photocopy       10    ৳20.00
----------------------------

মোট বিল: ৳70.00
জমা প্রদান: ৳40.00
বর্তমান বিলের বকেয়া: ৳30.00

----------------------------
পূর্বের বকেয়া: ৳0.00
*সর্বমোট বকেয়া: ৳30.00*

============================
আবার আসবেন 🙏
============================
```

---

### Test 4: Print Bill (Step 3 of 3)

1. Click **"প্রিন্ট করুন"** button
2. **Expected Result:**
   - Print preview dialog opens automatically
   - Receipt is formatted professionally
   - Shows all bill details, items, and ledger breakdown
3. You can:
   - Print to PDF
   - Print to physical printer
   - Or just close the dialog

---

### Test 5: Verify Ledger System (Multiple Bills)

1. Go back to **"Create Bill"** tab
2. Select **"Test Client 1"** again
3. **Verify:** Previous Due now shows ৳30.00 (from first bill)
4. Add new items:
   - Item: Legal Drafting, Qty: 1, Rate: 100
5. Set **জমা প্রদান:** 50
6. **Verify Summary:**
   - মোট বিল: ৳100.00
   - জমা প্রদান: ৳50.00
   - বর্তমান বকেয়া: ৳50.00
   - পূর্বের বকেয়া: ৳30.00
   - **সর্বমোট বকেয়া: ৳80.00** ✅
7. Generate → Send → Print
8. Go to **"Clients"** tab
9. **Verify:** Test Client 1's balance shows ৳80.00

---

### Test 6: Dashboard Analytics

1. Go to **"Dashboard"** tab
2. **Verify:**
   - Total Revenue shows sum of all bills
   - Total Clients shows correct count
   - Total Bills shows transaction count
3. **Verify Recent Transactions Table:**
   - Shows Bill/Paid/Due breakdown
   - Shows WhatsApp status (SENT/PENDING/FAILED)
   - Shows items count and names

---

### Test 7: Admin Settings

1. Go to **"Admin Settings"** tab
2. Update Business Profile:
   - Business Name: Your Shop Name
   - Business Phone: 01812345678
   - Footer Message: ধন্যবাদ আমাদের সাথে থাকার জন্য
3. Click **"Save Settings"**
4. **Verify:**
   - ✅ Success toast
   - Header shows updated business name
   - Next bill will use new settings

---

## 🐛 Troubleshooting

### Issue 1: "Unknown column 'subtotal'" Error

**Solution:** You forgot to run the migration!
```bash
node migrate_to_ledger.js
```

---

### Issue 2: WhatsApp Not Connecting

**Solutions:**
1. Check if QR code is visible in Admin Settings tab
2. Make sure you're scanning from WhatsApp → Settings → Linked Devices
3. Restart the server: `Ctrl+C` then `npm start`
4. Delete `.wwebjs_auth/` folder and scan again

---

### Issue 3: Bills Generated but WhatsApp Status is PENDING

**Reason:** WhatsApp client not connected when bill was generated

**Solution:**
1. Connect WhatsApp first (scan QR)
2. Wait for "WhatsApp Connected" status in header
3. Then generate bills

**Alternative:** Use the "WhatsApp পাঠান" button to send separately after connecting

---

### Issue 4: Buttons Stay Disabled

**Solution:**
1. Switch to Dashboard tab
2. Switch back to Create Bill tab
3. Form will reset automatically

---

### Issue 5: Print Shows Blank Page

**Reason:** Transaction data not loaded properly

**Solution:**
1. Check browser console for errors (F12)
2. Verify transaction ID exists in database
3. Try generating a new bill

---

## 📊 Database Structure

After migration, your `transactions` table will have:

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Transaction ID |
| `client_id` | INT | Reference to client |
| `type` | ENUM | INCOME/EXPENSE/DUE |
| `subtotal` | DECIMAL | মোট বিল (Total Bill) |
| `paid_amount` | DECIMAL | জমা প্রদান (Paid Amount) |
| `current_due` | DECIMAL | বর্তমান বিলের বকেয়া |
| `previous_due` | DECIMAL | পূর্বের বকেয়া |
| `total_due` | DECIMAL | সর্বমোট বকেয়া |
| `description` | TEXT | Notes |
| `whatsapp_status` | ENUM | SENT/FAILED/PENDING |
| `created_at` | TIMESTAMP | Date & time |

---

## 🎯 Features Summary

✅ **Ledger System:** Track paid amount, current due, previous due, total due  
✅ **Separate Buttons:** Generate → Send WhatsApp → Print (independent actions)  
✅ **Multi-Item Billing:** Add multiple items per bill  
✅ **WhatsApp Automation:** Professional Bengali receipts via WhatsApp  
✅ **QR Code in UI:** Scan WhatsApp QR directly from Admin Panel  
✅ **Auto Database Setup:** Works with XAMPP default settings  
✅ **Print Receipts:** Professional formatted printable bills  
✅ **Business Customization:** Update business name, phone, messages  
✅ **Client Management:** Add, edit, delete clients  
✅ **Dashboard Analytics:** Revenue, clients, bills overview  

---

## 🎉 Success Criteria

Your system is working perfectly if:

1. ✅ Migration runs without errors
2. ✅ Server starts and shows "Database auto-configured"
3. ✅ WhatsApp QR appears in terminal or Admin Panel
4. ✅ You can add clients
5. ✅ Generate button saves bill to database
6. ✅ Send WhatsApp button sends message (when connected)
7. ✅ Print button opens print dialog with formatted receipt
8. ✅ Previous due carries forward to next bill
9. ✅ Dashboard shows accurate stats
10. ✅ **Edit button opens edit modal with bill details**
11. ✅ **Edited bills save correctly and update client balance**
12. ✅ **Resend button sends WhatsApp again**

---

## 🆕 NEW: Test Bill Edit & Resend Feature

### Test 7: Edit Existing Bill

1. Go to **Dashboard** tab
2. Find any transaction in Recent Transactions table
3. Click the **blue Edit icon (🖊️)**
4. **Expected Result:**
   - Edit modal opens
   - Shows client name and previous due (read-only)
   - Shows all bill items with current values
   - Paid amount field is editable

5. **Make Changes:**
   - Change item quantity: 5 → 10
   - Change paid amount: 40 → 60
   - Verify "নতুন মোট বকেয়া" updates automatically
   
6. Click **"সংশোধন সেভ করুন"**
7. **Expected Result:**
   - ✅ Success toast: "বিল সংশোধন হয়েছে!"
   - Modal closes
   - Dashboard reloads with updated values
   
8. **Verify Client Balance:**
   - Go to Clients tab
   - Check client's balance
   - Should reflect the new total due

---

### Test 8: Resend WhatsApp

1. Go to **Dashboard** tab
2. Find a transaction (any status: SENT/PENDING/FAILED)
3. Click the **green WhatsApp icon (📱)**
4. **Expected Result:**
   - Confirmation dialog: "আবার WhatsApp পাঠাতে চান?"
   
5. Click **OK**
6. **Expected Result:**
   - ✅ Success toast: "WhatsApp পাঠানো হয়েছে!"
   - WhatsApp status updates to SENT
   - Client receives message again

---

### Test 9: Print from Dashboard

1. Go to **Dashboard** tab
2. Find any transaction
3. Click the **purple Print icon (🖨️)**
4. **Expected Result:**
   - Print dialog opens automatically
   - Shows professional formatted receipt
   - All details correct (items, amounts, ledger)

---

### Test 10: Complete Edit → Resend Workflow

**Scenario:** You sent a wrong bill, need to correct and resend

1. **Dashboard** → Find the wrong bill
2. Click **Edit icon**
3. Change items or paid amount
4. Save changes
5. Click **Resend WhatsApp icon**
6. **Expected Result:**
   - Client receives corrected bill
   - Balance updates correctly
   - Old balance removed, new balance added

**Formula Verification:**
```
Client Balance = Old Balance - Old Total Due + New Total Due
```

Example:
- Old Balance: ৳100
- Old Bill Total Due: ৳50
- New Bill Total Due: ৳80
- **New Balance = 100 - 50 + 80 = ৳130** ✅

---

## 📞 Need Help?

If you encounter issues not covered in this guide:

1. Check the terminal console for error messages
2. Check browser console (F12) for frontend errors
3. Verify XAMPP MySQL is running
4. Ensure port 3000 is not in use by another application

---

**Version:** 2.1.0 (Ledger System with Separate Buttons)  
**Last Updated:** Today ✨
