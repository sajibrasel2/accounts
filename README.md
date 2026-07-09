# 💼 Professional POS Billing & WhatsApp Automation System

A complete localhost-based billing system with WhatsApp integration, built with Node.js, Express, MySQL, and WhatsApp Web.js.

**Version:** 2.2.0 (Edit & Resend Feature)

---

## ✨ Key Features

### 🧾 Billing & Ledger System
- **Multi-Item Bills:** Add multiple items with quantity and rate
- **Ledger Tracking:** Complete due tracking system
  - মোট বিল (Subtotal)
  - জমা প্রদান (Paid Amount)
  - বর্তমান বিলের বকেয়া (Current Due)
  - পূর্বের বকেয়া (Previous Due)
  - সর্বমোট বকেয়া (Total Due)
- **Previous Due Carry Forward:** Automatically tracks client balances
- **Edit Bills:** Correct mistakes and update bills anytime
- **Balance Auto-Adjustment:** Client balance updates automatically when bills are edited

### 📱 WhatsApp Integration
- **Automatic Message Sending:** Professional Bengali receipts
- **QR Code in UI:** Scan directly from Admin Panel (no terminal needed)
- **Session Persistence:** Scan once, stay connected
- **Separate Send Action:** Generate first, send when ready
- **Resend Capability:** Send bills again if needed

### 🖨️ Three Independent Actions
1. **জেনারেট করুন (Generate):** Save bill to database
2. **WhatsApp পাঠান (Send WhatsApp):** Send message after generation
3. **প্রিন্ট করুন (Print):** Print professional receipt

### 🔧 Bill Management from Dashboard
- **Edit Bills:** Fix mistakes with full edit modal
  - Change items, quantities, rates
  - Update paid amount
  - Add/remove items
  - Live calculation of new total due
- **Resend WhatsApp:** Send corrected bills again
- **Direct Print:** Print any bill from dashboard
- **Action Buttons:** Edit (🖊️), Resend (📱), Print (🖨️)

### 🎨 Professional UI
- **Multi-Tab Interface:** Dashboard, Create Bill, Clients, Admin Settings
- **Real-Time Summary:** Live calculation of subtotal, paid, and dues
- **Responsive Design:** Works on desktop and mobile
- **Tailwind CSS:** Modern, clean interface

### ⚙️ Admin Features
- **Business Profile:** Customize business name, phone, address
- **Custom Messages:** Header and footer text for receipts
- **Client Management:** Add, edit, delete clients
- **Dashboard Analytics:** Revenue, client count, bill count

### 🔧 Technical Features
- **Auto Database Setup:** Works with XAMPP default settings
- **Zero Manual Configuration:** Database and tables created automatically
- **Migration System:** Easy upgrade from old versions
- **Localhost Only:** Completely private and secure

---

## 🚀 Quick Start

### Prerequisites
- **XAMPP** (or any MySQL server running on localhost)
- **Node.js** (v14 or higher)
- **WhatsApp Account** (for sending messages)

### Installation

```bash
# 1. Clone or download the project
cd billing-whatsapp-automation

# 2. Install dependencies
npm install

# 3. Run database migration (IMPORTANT!)
node migrate_to_ledger.js

# 4. Start the server
npm start
```

### First Time Setup

1. **Start XAMPP** and ensure MySQL is running
2. **Run migration** (see step 3 above)
3. **Start server** (see step 4 above)
4. **Open browser:** `http://localhost:3000`
5. **Connect WhatsApp:** Go to Admin Settings tab → Scan QR code
6. **Configure Business:** Update business name and phone
7. **Add Clients:** Go to Clients tab → Add your first client
8. **Create Bills:** Go to Create Bill tab → Start billing!

---

## 📖 Complete Workflow

### Generate a Bill

1. Select client from dropdown (shows previous due automatically)
2. Add items (Item name, Quantity, Rate)
3. Enter paid amount (জমা প্রদান)
4. Review summary panel
5. Click **"জেনারেট করুন"**
6. ✅ Bill saved to database

### Send WhatsApp

1. After generating, click **"WhatsApp পাঠান"**
2. Message sent to client's WhatsApp
3. ✅ Status updated to SENT

### Print Receipt

1. After generating, click **"প্রিন্ট করুন"**
2. Print dialog opens with formatted receipt
3. Save as PDF or print to paper

---

## 📁 Project Structure

```
billing-whatsapp-automation/
├── server.js                 # Express server & WhatsApp logic
├── db.js                     # MySQL connection & auto-setup
├── migrate_to_ledger.js      # Database migration script
├── package.json              # Dependencies
├── .env                      # Environment configuration
├── public/
│   ├── index.html           # Frontend UI
│   └── app.js               # Frontend JavaScript
├── README.md                 # This file
├── BILL_EDIT_GUIDE.md        # Bengali guide for editing bills
├── README_MIGRATION.md       # Migration instructions
└── SETUP_AND_TEST_GUIDE.md  # Complete testing guide
```

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=local_billing_db
PORT=3000
```

**Note:** Default values work with XAMPP out of the box!

---

## 📊 Database Schema

### Tables Created Automatically

1. **clients** - Customer information and balance
2. **transactions** - Bills with ledger columns
3. **bill_items** - Individual items per bill
4. **settings** - Business profile configuration

### Ledger Columns (transactions table)

| Column | Description |
|--------|-------------|
| `subtotal` | মোট বিল (Total Bill) |
| `paid_amount` | জমা প্রদান (Paid Amount) |
| `current_due` | বর্তমান বিলের বকেয়া (Current Bill Due) |
| `previous_due` | পূর্বের বকেয়া (Previous Due) |
| `total_due` | সর্বমোট বকেয়া (Total Due) |

**Formula:** `total_due = previous_due + (subtotal - paid_amount)`

---

## 📱 WhatsApp Message Format

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

## 🐛 Troubleshooting

### "Unknown column 'subtotal'" Error
**Solution:** Run the migration script first!
```bash
node migrate_to_ledger.js
```

### WhatsApp Not Connecting
1. Go to Admin Settings tab
2. Check if QR code is visible
3. Scan from WhatsApp → Settings → Linked Devices → Link a Device
4. Wait for "WhatsApp Connected" status

### Port 3000 Already in Use
Change the port in `.env`:
```env
PORT=3001
```

### Database Connection Failed
1. Ensure XAMPP MySQL is running
2. Check if using default credentials (root, no password)
3. Verify `DB_HOST=localhost` in `.env`

---

## 🎯 API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client (with balance)
- `POST /api/clients` - Add new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get single transaction (for print/edit)
- `POST /api/transactions` - Generate bill (save to DB)
- `PUT /api/transactions/:id` - Update existing bill (edit feature)
- `POST /api/transactions/:id/send-whatsapp` - Send/Resend WhatsApp message

### Settings
- `GET /api/settings` - Get business settings
- `POST /api/settings` - Update business settings

### WhatsApp
- `GET /api/whatsapp/status` - Check connection status with QR

---

## 📦 Dependencies

### Backend
- **express** - Web server
- **mysql2** - Database driver
- **whatsapp-web.js** - WhatsApp automation
- **qrcode** - QR code generation for UI
- **qrcode-terminal** - QR code in terminal
- **dotenv** - Environment configuration
- **cors** - CORS handling

### Frontend
- **Tailwind CSS** (CDN) - UI styling
- **Font Awesome** (CDN) - Icons

---

## 🆕 Version History

### Version 2.2.0 (Current - Latest)
- ✅ **Edit Bills Feature:** Full bill editing capability
- ✅ **Resend WhatsApp:** Send corrected bills again
- ✅ **Dashboard Actions:** Edit, Resend, Print buttons in transactions table
- ✅ **Smart Balance Adjustment:** Automatic ledger recalculation on edit
- ✅ **Live Edit Summary:** Real-time calculation while editing
- ✅ **Direct Print from Dashboard:** Print any bill instantly

### Version 2.1.0
- ✅ Ledger system with paid amount and due tracking
- ✅ Separate buttons: Generate → Send → Print
- ✅ Previous due carry forward
- ✅ Enhanced WhatsApp message with ledger details
- ✅ Print receipt functionality
- ✅ Migration script for existing databases

### Version 2.0.0
- Multi-item billing support
- WhatsApp QR in Admin Panel
- Business profile customization
- POS-style interface with tabs
- Settings management

### Version 1.0.0
- Basic billing system
- Single-item transactions
- Terminal-only WhatsApp QR
- Simple client management

---

## 🌐 Production Deployment (cPanel/Live Server)

### Step 1: Prepare Your Server

1. **Upload Files to Server:**
   - Upload all project files to your cPanel via FTP or File Manager
   - Typical path: `public_html/billing/` or `home/username/billing/`

2. **Install Node.js on Server:**
   - Most cPanel hosts support Node.js
   - Enable Node.js from cPanel → Setup Node.js App
   - Select Node.js version (v14 or higher recommended)

### Step 2: Configure Production Database

1. **Create MySQL Database in cPanel:**
   - Go to cPanel → MySQL Databases
   - Create new database: `techandc_accounts`
   - Create database user: `techandc_bot`
   - Set password: `12345Sajibs6@`
   - Add user to database with ALL PRIVILEGES

2. **Configure Environment:**
   - Copy `.env.production` to `.env` on your server
   - Or manually update `.env` with production credentials:
   
   ```env
   DB_HOST=localhost
   DB_USER=techandc_bot
   DB_PASSWORD=12345Sajibs6@
   DB_NAME=techandc_accounts
   PORT=3000
   NODE_ENV=production
   ```

### Step 3: Install and Run

```bash
# SSH into your server
ssh username@your-server.com

# Navigate to project directory
cd ~/billing

# Install dependencies
npm install

# Run database migration
node migrate_to_ledger.js

# Start server (use PM2 for production)
npm install -g pm2
pm2 start server.js --name "billing-system"
pm2 save
pm2 startup
```

### Step 4: Access Your Application

- **Direct Access:** `http://your-domain.com:3000`
- **With Domain:** Configure reverse proxy in cPanel or use subdomain

### Step 5: Setup WhatsApp on Production

1. Open your production URL
2. Go to Admin Settings tab
3. Scan QR code with your business WhatsApp
4. ✅ WhatsApp connected and ready!

### Production vs Localhost

| Feature | Localhost (XAMPP) | Production (cPanel) |
|---------|------------------|---------------------|
| Database Host | localhost | localhost |
| DB User | root | techandc_bot |
| DB Password | (empty) | 12345Sajibs6@ |
| DB Name | local_billing_db | techandc_accounts |
| Node Env | development | production |
| Access URL | http://localhost:3000 | http://your-domain.com:3000 |

### Switch Between Environments

To switch from production to localhost (or vice versa):

1. Open `.env` file
2. Comment/uncomment the appropriate database lines:

```env
# For PRODUCTION - uncomment these:
DB_HOST=localhost
DB_USER=techandc_bot
DB_PASSWORD=12345Sajibs6@
DB_NAME=techandc_accounts

# For LOCALHOST - uncomment these:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=local_billing_db
```

3. Restart server: `pm2 restart billing-system` (production) or `npm start` (localhost)

### PM2 Commands (Production Server Management)

```bash
# Start server
pm2 start server.js --name "billing-system"

# Restart server
pm2 restart billing-system

# Stop server
pm2 stop billing-system

# View logs
pm2 logs billing-system

# View status
pm2 status

# Auto-start on server reboot
pm2 startup
pm2 save
```

---

## 📜 License

ISC License - Free to use and modify for personal or commercial projects.

---

## 🙏 Credits

Built with ❤️ for local businesses using modern web technologies.

**Technologies:**
- Node.js & Express
- MySQL (XAMPP)
- WhatsApp Web.js
- Tailwind CSS
- Font Awesome

---

## 📞 Support

For issues or questions:
1. Check `BILL_EDIT_GUIDE.md` for bill correction instructions (Bengali)
2. Check `SETUP_AND_TEST_GUIDE.md` for detailed testing instructions
3. Check `README_MIGRATION.md` for migration help
4. Review troubleshooting section above
5. Check browser console (F12) and terminal for error messages

---

## 🎉 Ready to Use!

Your professional billing system is ready. Follow the Quick Start guide above and start generating bills with WhatsApp automation!

**Happy Billing! 💼📱✨**
