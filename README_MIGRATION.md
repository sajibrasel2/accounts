# 🔄 Database Migration Required

## ⚠️ Important: Run Migration First!

You're getting the **"Unknown column 'subtotal'"** error because your database needs to be updated with the new ledger system columns.

### Run Migration Now:

```bash
node migrate_to_ledger.js
```

This will add the following columns to your `transactions` table:
- `subtotal` - মোট বিল
- `paid_amount` - জমা প্রদান
- `current_due` - বর্তমান বিলের বকেয়া
- `previous_due` - পূর্বের বকেয়া
- `total_due` - সর্বমোট বকেয়া

### After Migration:

1. Start your server: `npm start` or `node server.js`
2. The new separate buttons will work:
   - **জেনারেট করুন** (Generate) - Saves bill to database
   - **WhatsApp পাঠান** (Send WhatsApp) - Sends after generation
   - **প্রিন্ট করুন** (Print) - Prints receipt

---

## ✅ Migration is safe:
- Existing data will be preserved
- Old transactions will be converted automatically
- No data will be lost

Run it now! ✨
