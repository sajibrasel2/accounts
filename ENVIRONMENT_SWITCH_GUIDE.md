# 🔄 Environment Switch Guide

Quick reference for switching between localhost (XAMPP) and production (cPanel) environments.

---

## 🎯 Quick Switch

### Switch to PRODUCTION

1. **Open `.env` file**
2. **Comment out LOCALHOST lines, uncomment PRODUCTION lines:**

```env
# 🌐 PRODUCTION DATABASE (Active)
DB_HOST=localhost
DB_USER=techandc_bot
DB_PASSWORD=12345Sajibs6@
DB_NAME=techandc_accounts

# 💻 LOCALHOST DATABASE (Inactive)
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=local_billing_db
```

3. **Restart server:**
   - Localhost: Stop (Ctrl+C) and run `npm start`
   - Production: `pm2 restart billing-system`

---

### Switch to LOCALHOST

1. **Open `.env` file**
2. **Comment out PRODUCTION lines, uncomment LOCALHOST lines:**

```env
# 🌐 PRODUCTION DATABASE (Inactive)
# DB_HOST=localhost
# DB_USER=techandc_bot
# DB_PASSWORD=12345Sajibs6@
# DB_NAME=techandc_accounts

# 💻 LOCALHOST DATABASE (Active)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=local_billing_db
```

3. **Restart server:**
   ```bash
   # Stop server (Ctrl+C)
   npm start
   ```

---

## 📋 Environment Comparison

| Feature | Localhost (XAMPP) | Production (cPanel) |
|---------|------------------|---------------------|
| **Database Host** | localhost | localhost |
| **Database User** | root | techandc_bot |
| **Database Password** | (empty) | 12345Sajibs6@ |
| **Database Name** | local_billing_db | techandc_accounts |
| **PORT** | 3000 | 3000 (or custom) |
| **NODE_ENV** | development | production |
| **Access URL** | http://localhost:3000 | http://your-domain.com:3000 |
| **WhatsApp Session** | Local folder | Server folder |
| **Backups** | Local device | Server storage |
| **Process Manager** | npm start | PM2 (persistent) |

---

## 🚀 Commands by Environment

### Localhost (XAMPP)

```bash
# Start XAMPP MySQL
# Open XAMPP Control Panel → Start MySQL

# Start application
npm start

# Stop application
# Press Ctrl+C in terminal

# View logs
# Check terminal output

# Access application
http://localhost:3000
```

### Production (cPanel)

```bash
# SSH into server
ssh username@your-server.com

# Navigate to project
cd ~/public_html/billing

# Start application
pm2 start server.js --name billing-system

# Restart application
pm2 restart billing-system

# Stop application
pm2 stop billing-system

# View logs
pm2 logs billing-system

# View status
pm2 status

# Access application
http://your-domain.com:3000
```

---

## 🔄 Testing on Both Environments

### Test Locally First

1. **Switch to LOCALHOST** (see above)
2. **Test all features:**
   - Add clients
   - Create bills
   - Send WhatsApp (with your test number)
   - Edit bills
   - Print receipts
   - Backup/restore
3. **Verify everything works**

### Deploy to Production

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Pull on production server:**
   ```bash
   ssh username@your-server.com
   cd ~/public_html/billing
   git pull origin main
   npm install
   pm2 restart billing-system
   ```

3. **Switch to PRODUCTION** in `.env`
4. **Test on production:**
   - Same test checklist as localhost

---

## ⚠️ Common Mistakes

### Mistake 1: Using wrong database

**Symptom:** Can't see your data after switching
**Solution:** Check `.env` - make sure correct database lines are active

### Mistake 2: Forgot to restart server

**Symptom:** Changes not reflected
**Solution:** Always restart after changing `.env`

### Mistake 3: Production credentials on localhost

**Symptom:** Connection errors on localhost
**Solution:** Use `root` (no password) for localhost

### Mistake 4: Localhost credentials on production

**Symptom:** Connection errors on production
**Solution:** Use `techandc_bot` with correct password

---

## 🔐 Security Notes

### DO NOT commit `.env` to Git

✅ `.env` is in `.gitignore` - never commit it!
✅ Use `.env.example` as template for others

### Different credentials for each environment

✅ Localhost: Default XAMPP (root, no password)
✅ Production: Strong credentials (techandc_bot, 12345Sajibs6@)

### Keep production credentials secure

❌ Never share production `.env` file
❌ Never commit production credentials
✅ Only share `.env.example` with sensitive data removed

---

## 📝 Quick Reference Cards

### 🏠 Localhost Setup Card

```
┌─────────────────────────────────┐
│   LOCALHOST (XAMPP) SETUP       │
├─────────────────────────────────┤
│ DB_HOST=localhost               │
│ DB_USER=root                    │
│ DB_PASSWORD=                    │
│ DB_NAME=local_billing_db        │
│ PORT=3000                       │
│ NODE_ENV=development            │
├─────────────────────────────────┤
│ Start: npm start                │
│ Stop: Ctrl+C                    │
│ URL: http://localhost:3000      │
└─────────────────────────────────┘
```

### 🌐 Production Setup Card

```
┌─────────────────────────────────┐
│   PRODUCTION (cPanel) SETUP     │
├─────────────────────────────────┤
│ DB_HOST=localhost               │
│ DB_USER=techandc_bot            │
│ DB_PASSWORD=12345Sajibs6@       │
│ DB_NAME=techandc_accounts       │
│ PORT=3000                       │
│ NODE_ENV=production             │
├─────────────────────────────────┤
│ Start: pm2 start server.js      │
│ Restart: pm2 restart billing    │
│ Stop: pm2 stop billing          │
│ Logs: pm2 logs billing          │
│ URL: http://domain.com:3000     │
└─────────────────────────────────┘
```

---

## 🎯 Decision Guide

### When to use LOCALHOST?

✅ Development and testing
✅ Adding new features
✅ Debugging issues
✅ Learning the system
✅ Private data (not sharing online)

### When to use PRODUCTION?

✅ Live business operations
✅ Multiple users/devices
✅ Remote access needed
✅ 24/7 availability required
✅ Professional deployment

---

## 🆘 Need Help?

### Support Contacts
- 📱 WhatsApp: 01739354392
- 💬 Facebook: fb.com/sajibrasel2
- 📧 Email: raselsajib25@gmail.com

### Documentation
- 📖 `README.md` - Complete feature guide
- 🚀 `DEPLOYMENT_GUIDE.md` - Full deployment steps
- 🔧 `FINAL_SETUP_GUIDE.md` - Setup instructions
- 🐛 `TROUBLESHOOTING.md` - Common issues (if exists)

---

**Quick Tips:**
- Always test on localhost before deploying to production
- Keep both environments synchronized (same code version)
- Backup both databases regularly
- Use git for version control

**Happy Developing! 💻✨**
