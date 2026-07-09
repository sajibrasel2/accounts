# Changelog

## [1.1.0] - XAMPP Automation Update

### ✨ Added
- **Fully automated database setup** - No manual database creation needed
- **XAMPP default configuration** - Works out-of-the-box with XAMPP
- **Auto-configuration function** - `autoConfigureDatabase()` in `db.js`
- **XAMPP Quick Start Guide** - `XAMPP_SETUP.md` for simplified setup
- Automatic database creation on server start
- Automatic table creation with indexes

### 🔄 Changed
- **`db.js`**: Complete rewrite with automated setup
  - Now connects without database first
  - Creates database if not exists
  - Creates tables with indexes automatically
  - Uses XAMPP defaults (root with no password)
  
- **`server.js`**: Updated to use new database module
  - Replaced `testConnection()` and `initializeDatabase()` with `autoConfigureDatabase()`
  - All API endpoints now use `getPool()` instead of direct pool access
  - Cleaner startup sequence
  
- **`.env`**: Updated with XAMPP defaults
  - Password field now empty (XAMPP default)
  - Added clear comments about XAMPP compatibility
  
- **`README.md`**: Completely rewritten setup instructions
  - XAMPP-first approach
  - Removed manual database creation steps
  - Added automated setup verification steps
  - Updated troubleshooting for XAMPP users

### 🗑️ Removed
- Manual database creation requirement
- Manual schema.sql execution requirement
- Complex MySQL command-line instructions

### 🐛 Fixed
- Database initialization now happens before server starts
- Better error handling for database connection issues
- Graceful handling of existing databases and tables

---

## [1.0.0] - Initial Release

### Features
- Client management system
- Transaction tracking (Income, Expense, Due)
- WhatsApp integration with Bengali messages
- Session persistence for WhatsApp
- Phone number auto-formatting for Bangladesh
- Modern Tailwind CSS dashboard
- Real-time status updates
- Auto-refresh functionality
