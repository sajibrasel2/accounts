const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const { autoConfigureDatabase, getPool } = require('./db');
const { validateLicense, shouldShowWarning } = require('./license_system');
const { initializeTrialSystem, getTrialStatus, startFreeTrial, activateWithLicense } = require('./trial_system');
const { getMachineId } = require('./machine_id');
const { createCompleteBackup, listBackups, cleanupOldBackups } = require('./backup_system');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for logo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'logo-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPG, GIF) are allowed!'));
    }
  }
});

// License Configuration (প্রতিটি client এর জন্য আলাদা)
const LICENSE_CONFIG = {
  clientName: process.env.LICENSE_CLIENT_NAME || 'Demo User',
  licenseKey: process.env.LICENSE_KEY || 'DEMO-KEY-EXPIRES-SOON',
  expiryDate: process.env.LICENSE_EXPIRY || '2025-01-31' // YYYY-MM-DD format
};

// License validation
let licenseStatus = null;
let trialStatus = null;
let machineInfo = null;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// WhatsApp Client Setup
let whatsappClient = null;
let isWhatsAppReady = false;
let currentQRCode = null; // Store current QR code for frontend

const initializeWhatsApp = () => {
  whatsappClient = new Client({
    authStrategy: new LocalAuth({
      dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    }
  });

  whatsappClient.on('qr', async (qr) => {
    console.log('\n📱 Scan this QR code with WhatsApp on your phone:\n');
    qrcodeTerminal.generate(qr, { small: true });
    console.log('\n');
    
    // Generate base64 QR code for frontend
    try {
      currentQRCode = await QRCode.toDataURL(qr);
    } catch (error) {
      console.error('Error generating QR code image:', error);
    }
  });

  whatsappClient.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
    isWhatsAppReady = true;
    currentQRCode = null; // Clear QR code once authenticated
  });

  whatsappClient.on('authenticated', () => {
    console.log('✅ WhatsApp authenticated successfully');
    currentQRCode = null;
  });

  whatsappClient.on('auth_failure', (msg) => {
    console.error('❌ WhatsApp authentication failed:', msg);
    isWhatsAppReady = false;
  });

  whatsappClient.on('disconnected', (reason) => {
    console.log('❌ WhatsApp client disconnected:', reason);
    isWhatsAppReady = false;
    currentQRCode = null;
  });

  whatsappClient.initialize();
};

// Utility: Format phone number for WhatsApp
function formatPhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('0')) {
    cleaned = '880' + cleaned.substring(1);
  }
  
  if (!cleaned.startsWith('880')) {
    cleaned = '880' + cleaned;
  }
  
  return cleaned + '@c.us';
}

// Utility: Send Professional WhatsApp Bill with Ledger
async function sendWhatsAppBill(clientData, items, ledger, settings) {
  if (!isWhatsAppReady) {
    throw new Error('WhatsApp client is not ready');
  }

  const formattedPhone = formatPhoneNumber(clientData.phone);
  
  // Format date in Bengali
  const now = new Date();
  const date = now.toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Build item list with better formatting
  let itemsList = '';
  items.forEach((item, index) => {
    const itemTotal = item.quantity * item.rate;
    const itemName = item.item_name.padEnd(12, ' ');
    const qty = String(item.quantity).padStart(3, ' ');
    const price = `৳${itemTotal.toFixed(2)}`;
    itemsList += `${index + 1}. ${itemName} ${qty}  ${price}\n`;
  });
  
  // Professional ledger-based receipt template with box design
  const message = 
    `╔════════════════════════════╗\n` +
    `║  🏢 *${settings.business_name}*\n` +
    (settings.business_phone ? `║  📞 ${settings.business_phone}\n` : '') +
    `╚════════════════════════════╝\n\n` +
    
    `┌────────────────────────────┐\n` +
    `│ 👤 *ক্লায়েন্ট:* ${clientData.name}\n` +
    `│ 📱 মোবাইল: ${clientData.phone}\n` +
    `│ 📅 তারিখ: ${date}\n` +
    `└────────────────────────────┘\n\n` +
    
    `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n` +
    `┃ *বিবরণ*        *পরিমাণ  মূল্য*\n` +
    `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n` +
    itemsList +
    `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n` +
    
    `┌────────────────────────────┐\n` +
    `│ মোট বিল:       ৳${ledger.subtotal.toFixed(2)}\n` +
    `│ জমা প্রদান:     ৳${ledger.paidAmount.toFixed(2)}\n` +
    `│ *বর্তমান বকেয়া: ৳${ledger.currentDue.toFixed(2)}*\n` +
    `└────────────────────────────┘\n\n` +
    
    `╔════════════════════════════╗\n` +
    `║ পূর্বের বকেয়া:  ৳${ledger.previousDue.toFixed(2)}\n` +
    `║ ✨ *সর্বমোট বকেয়া:* ✨\n` +
    `║      *৳${ledger.totalDue.toFixed(2)}*\n` +
    `╚════════════════════════════╝\n\n` +
    
    (settings.footer_text ? `💬 ${settings.footer_text}\n\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  try {
    await whatsappClient.sendMessage(formattedPhone, message);
    return 'SENT';
  } catch (error) {
    console.error('WhatsApp send error:', error.message);
    return 'FAILED';
  }
}

// API Routes

// Get WhatsApp status with QR code
app.get('/api/whatsapp/status', (req, res) => {
  res.json({ 
    success: true, 
    ready: isWhatsAppReady,
    qrCode: currentQRCode,
    message: isWhatsAppReady ? 'WhatsApp is connected' : 'WhatsApp is not connected'
  });
});

// Get License Status
app.get('/api/license/status', (req, res) => {
  const validation = validateLicense(
    LICENSE_CONFIG.licenseKey,
    LICENSE_CONFIG.clientName,
    LICENSE_CONFIG.expiryDate
  );
  
  licenseStatus = validation;
  
  res.json({
    success: true,
    license: {
      clientName: LICENSE_CONFIG.clientName,
      status: validation.status,
      valid: validation.valid,
      message: validation.message,
      daysRemaining: validation.daysRemaining || 0,
      expiryDate: LICENSE_CONFIG.expiryDate,
      showWarning: validation.daysRemaining ? shouldShowWarning(validation.daysRemaining) : false
    },
    developer: {
      name: 'Sajib Digital Hub',
      contact: '01739354392',
      facebook: '@sajibrasel2'
    }
  });
});

// Get Trial/Activation Status (Combined)
app.get('/api/system/status', async (req, res) => {
  try {
    // Get machine info
    const machine = getMachineId();
    machineInfo = machine;
    
    // Get trial status
    const trial = await getTrialStatus();
    trialStatus = trial;
    
    // Check license validation
    const license = validateLicense(
      LICENSE_CONFIG.licenseKey,
      LICENSE_CONFIG.clientName,
      LICENSE_CONFIG.expiryDate
    );
    licenseStatus = license;
    
    // Determine system status
    let systemStatus = 'UNKNOWN';
    let systemMessage = '';
    let isLocked = false;
    let canUpgrade = false;
    let requiresAction = false;
    
    // Priority 1: Check if activated with valid license
    if (trial.isActivated && license.valid) {
      systemStatus = 'ACTIVATED';
      systemMessage = `Full version activated - ${license.daysRemaining} days remaining`;
      isLocked = false;
      canUpgrade = false;
    }
    // Priority 2: Check if trial expired
    else if (trial.trialExpired) {
      systemStatus = 'TRIAL_EXPIRED';
      systemMessage = `Free trial expired ${trial.daysExpired} days ago - Upgrade required`;
      isLocked = true;
      canUpgrade = true;
      requiresAction = true;
    }
    // Priority 3: Check if trial active
    else if (trial.isTrialActive) {
      systemStatus = 'TRIAL_ACTIVE';
      systemMessage = `Free trial: ${trial.daysRemaining} days remaining`;
      isLocked = false;
      canUpgrade = true;
      requiresAction = trial.showWarning; // Show upgrade prompt in last 3 days
    }
    // Priority 4: No trial started
    else if (trial.trialAvailable) {
      systemStatus = 'TRIAL_AVAILABLE';
      systemMessage = '15-day free trial available - Start now!';
      isLocked = false;
      canUpgrade = true;
      requiresAction = false;
    }
    // Fallback
    else {
      systemStatus = 'UNKNOWN';
      systemMessage = 'System status unknown';
      isLocked = false;
      canUpgrade = true;
    }
    
    res.json({
      success: true,
      system: {
        status: systemStatus,
        message: systemMessage,
        isLocked: isLocked,
        canUpgrade: canUpgrade,
        requiresAction: requiresAction
      },
      trial: {
        status: trial.status,
        isActive: trial.isTrialActive || false,
        isExpired: trial.trialExpired || false,
        isActivated: trial.isActivated || false,
        daysRemaining: trial.daysRemaining || 0,
        daysUsed: trial.daysUsed || 0,
        expiresAt: trial.trialExpires || null,
        showWarning: trial.showWarning || false
      },
      license: {
        clientName: LICENSE_CONFIG.clientName,
        status: license.status,
        valid: license.valid,
        daysRemaining: license.daysRemaining || 0,
        expiryDate: LICENSE_CONFIG.expiryDate
      },
      machine: {
        id: machine.machineId,
        hostname: machine.components.hostname,
        platform: machine.components.platform
      },
      developer: {
        name: 'Sajib Digital Hub',
        contact: '01739354392',
        facebook: '@sajibrasel2',
        whatsapp: 'https://wa.me/8801739354392'
      }
    });
    
  } catch (error) {
    console.error('Error getting system status:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Start Free Trial
app.post('/api/trial/start', async (req, res) => {
  try {
    const result = await startFreeTrial();
    
    if (result.success) {
      res.json({
        success: true,
        message: '15-day free trial started successfully!',
        trial: result.trial
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        status: result.status
      });
    }
  } catch (error) {
    console.error('Error starting trial:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Activate with License Key
app.post('/api/license/activate', async (req, res) => {
  const { licenseKey, clientName, expiryDate } = req.body;
  
  if (!licenseKey || !clientName || !expiryDate) {
    return res.status(400).json({
      success: false,
      message: 'License key, client name, and expiry date are required'
    });
  }
  
  try {
    // Validate license first
    const validation = validateLicense(licenseKey, clientName, expiryDate);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid license key or expired license',
        validation: validation
      });
    }
    
    // Activate in trial system
    const result = await activateWithLicense(licenseKey, clientName, expiryDate);
    
    if (result.success) {
      // Update .env file (optional - can be done manually)
      // For now, just return success
      res.json({
        success: true,
        message: 'License activated successfully! Please restart the server for changes to take effect.',
        activation: result,
        nextSteps: [
          'Update .env file with new license details',
          'Restart the server (node server.js)',
          'System will be fully unlocked'
        ]
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }
    
  } catch (error) {
    console.error('Error activating license:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════
// BACKUP & RESTORE API ENDPOINTS
// ═══════════════════════════════════════════════════════════

// Create complete backup (MySQL + JSON + CSV)
app.post('/api/backup/create', async (req, res) => {
  try {
    console.log('📦 Starting manual backup...');
    const result = await createCompleteBackup();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Backup created successfully',
        backup: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || 'Backup failed'
      });
    }
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// List all available backups
app.get('/api/backup/list', (req, res) => {
  try {
    const backups = listBackups();
    
    res.json({
      success: true,
      backups: backups,
      summary: {
        mysql: backups.mysql.length,
        json: backups.json.length,
        csv: backups.csv.length,
        total: backups.mysql.length + backups.json.length + backups.csv.length
      }
    });
  } catch (error) {
    console.error('Error listing backups:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Download backup file
app.get('/api/backup/download/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    const path = require('path');
    
    let filepath;
    
    if (type === 'mysql') {
      filepath = path.join(__dirname, 'backups', 'mysql', filename);
    } else if (type === 'json') {
      filepath = path.join(__dirname, 'backups', 'json', filename);
    } else if (type === 'csv') {
      filepath = path.join(__dirname, 'backups', 'csv', filename);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid backup type'
      });
    }
    
    // Check if file/folder exists
    const fs = require('fs');
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Backup file not found'
      });
    }
    
    // If it's a folder (JSON/CSV), zip it first
    if (fs.statSync(filepath).isDirectory()) {
      // For now, just return folder info
      // In production, you'd want to zip the folder
      return res.json({
        success: true,
        message: 'Folder download requires manual copy',
        path: filepath
      });
    }
    
    // Download single file
    res.download(filepath, filename);
    
  } catch (error) {
    console.error('Error downloading backup:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Cleanup old backups
app.post('/api/backup/cleanup', async (req, res) => {
  try {
    const { keepCount } = req.body;
    const count = parseInt(keepCount) || 10;
    
    const result = cleanupOldBackups(count);
    
    res.json({
      success: true,
      message: result.message,
      deletedCount: result.deletedCount,
      keepCount: result.keepCount
    });
  } catch (error) {
    console.error('Error cleaning up backups:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get settings
app.get('/api/settings', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM settings LIMIT 1');
    
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.json({ 
        success: true, 
        data: {
          business_name: 'Sajib Digital hub',
          business_phone: '',
          business_address: '',
          header_text: 'ধন্যবাদ আমাদের সেবা নেওয়ার জন্য',
          footer_text: 'আবার আসবেন 🙏'
        }
      });
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update settings
app.post('/api/settings', async (req, res) => {
  const { business_name, business_phone, business_address, header_text, footer_text } = req.body;
  
  try {
    const pool = getPool();
    
    // Check if settings exist
    const [existing] = await pool.query('SELECT id FROM settings LIMIT 1');
    
    if (existing.length > 0) {
      // Update existing settings
      await pool.query(
        'UPDATE settings SET business_name = ?, business_phone = ?, business_address = ?, header_text = ?, footer_text = ? WHERE id = ?',
        [business_name, business_phone, business_address, header_text, footer_text, existing[0].id]
      );
    } else {
      // Insert new settings
      await pool.query(
        'INSERT INTO settings (business_name, business_phone, business_address, header_text, footer_text) VALUES (?, ?, ?, ?, ?)',
        [business_name, business_phone, business_address, header_text, footer_text]
      );
    }
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload Logo
app.post('/api/settings/logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const pool = getPool();
    const logoPath = '/uploads/' + req.file.filename;
    
    // Get current settings to delete old logo if exists
    const [existing] = await pool.query('SELECT logo_path FROM settings LIMIT 1');
    
    if (existing.length > 0 && existing[0].logo_path) {
      // Delete old logo file
      const oldLogoPath = path.join(__dirname, 'public', existing[0].logo_path);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
      
      // Update logo path
      await pool.query('UPDATE settings SET logo_path = ? WHERE id = ?', [logoPath, existing[0].id]);
    } else {
      // Insert new settings with logo
      await pool.query('INSERT INTO settings (logo_path) VALUES (?)', [logoPath]);
    }
    
    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      logo_path: logoPath
    });
    
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove Logo
app.delete('/api/settings/logo', async (req, res) => {
  try {
    const pool = getPool();
    
    // Get current logo path
    const [existing] = await pool.query('SELECT id, logo_path FROM settings LIMIT 1');
    
    if (existing.length > 0 && existing[0].logo_path) {
      // Delete logo file
      const logoPath = path.join(__dirname, 'public', existing[0].logo_path);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
      
      // Remove logo path from database
      await pool.query('UPDATE settings SET logo_path = NULL WHERE id = ?', [existing[0].id]);
      
      res.json({ success: true, message: 'Logo removed successfully' });
    } else {
      res.json({ success: true, message: 'No logo to remove' });
    }
    
  } catch (error) {
    console.error('Error removing logo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all clients
app.get('/api/clients', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM clients ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single client by ID (for fetching previous due)
app.get('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM clients WHERE id = ?',
      [id]
    );
    
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.status(404).json({ success: false, message: 'Client not found' });
    }
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get client statement with date filter
app.get('/api/clients/:id/statement', async (req, res) => {
  const { id } = req.params;
  const { from_date, to_date } = req.query;
  
  try {
    const pool = getPool();
    
    // Get client info
    const [clients] = await pool.query(
      'SELECT * FROM clients WHERE id = ?',
      [id]
    );
    
    if (clients.length === 0) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    const client = clients[0];
    
    // Build query for transactions
    let query = `
      SELECT t.*, 
             (SELECT COUNT(*) FROM bill_items WHERE transaction_id = t.id) as items_count
      FROM transactions t
      WHERE t.client_id = ?
    `;
    
    const params = [id];
    
    if (from_date && to_date) {
      query += ` AND DATE(t.created_at) BETWEEN ? AND ?`;
      params.push(from_date, to_date);
    } else if (from_date) {
      query += ` AND DATE(t.created_at) >= ?`;
      params.push(from_date);
    } else if (to_date) {
      query += ` AND DATE(t.created_at) <= ?`;
      params.push(to_date);
    }
    
    query += ` ORDER BY t.created_at DESC`;
    
    const [transactions] = await pool.query(query, params);
    
    // Calculate summary
    let totalIncome = 0;
    let totalPaid = 0;
    let totalDue = 0;
    
    transactions.forEach(t => {
      if (t.type === 'INCOME') {
        totalIncome += parseFloat(t.subtotal);
      }
      totalPaid += parseFloat(t.paid_amount || 0);
      totalDue += parseFloat(t.current_due || 0);
    });
    
    // Get items for each transaction
    for (let transaction of transactions) {
      const [items] = await pool.query(
        'SELECT * FROM bill_items WHERE transaction_id = ?',
        [transaction.id]
      );
      transaction.items = items;
    }
    
    res.json({
      success: true,
      client: {
        id: client.id,
        name: client.name,
        phone: client.phone,
        current_balance: parseFloat(client.balance)
      },
      period: {
        from: from_date || 'Beginning',
        to: to_date || 'Today'
      },
      transactions: transactions,
      summary: {
        total_bills: transactions.length,
        total_income: totalIncome,
        total_paid: totalPaid,
        total_due: totalDue,
        current_balance: parseFloat(client.balance)
      }
    });
    
  } catch (error) {
    console.error('Error fetching client statement:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new client
app.post('/api/clients', async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name and phone are required' 
    });
  }

  try {
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO clients (name, phone, balance) VALUES (?, ?, 0.00)',
      [name, phone]
    );
    
    res.json({ 
      success: true, 
      message: 'Client added successfully',
      data: { id: result.insertId, name, phone, balance: 0.00 }
    });
  } catch (error) {
    console.error('Error adding client:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number already exists' 
      });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update client
app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name and phone are required' 
    });
  }

  try {
    const pool = getPool();
    await pool.query(
      'UPDATE clients SET name = ?, phone = ? WHERE id = ?',
      [name, phone, id]
    );
    
    res.json({ 
      success: true, 
      message: 'Client updated successfully'
    });
  } catch (error) {
    console.error('Error updating client:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number already exists' 
      });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete client
app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = getPool();
    await pool.query('DELETE FROM clients WHERE id = ?', [id]);
    
    res.json({ 
      success: true, 
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all transactions with items
app.get('/api/transactions', async (req, res) => {
  try {
    const pool = getPool();
    const [transactions] = await pool.query(`
      SELECT t.*, c.name as client_name, c.phone as client_phone 
      FROM transactions t
      INNER JOIN clients c ON t.client_id = c.id
      ORDER BY t.created_at DESC
      LIMIT 100
    `);
    
    // Get items for each transaction
    for (let transaction of transactions) {
      const [items] = await pool.query(
        'SELECT * FROM bill_items WHERE transaction_id = ?',
        [transaction.id]
      );
      transaction.items = items;
    }
    
    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new transaction (Generate Bill - without sending WhatsApp)
app.post('/api/transactions', async (req, res) => {
  const { client_id, type, items, paid_amount, description } = req.body;

  if (!client_id || !type || !items || items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Client ID, type, and at least one item are required' 
    });
  }

  try {
    const pool = getPool();
    
    // Get client details with current balance (Previous Due)
    const [clients] = await pool.query(
      'SELECT * FROM clients WHERE id = ?',
      [client_id]
    );

    if (clients.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
    }

    const client = clients[0];
    const previousDue = parseFloat(client.balance) || 0;
    
    // Calculate subtotal from items
    let subtotal = 0;
    items.forEach(item => {
      subtotal += parseFloat(item.quantity) * parseFloat(item.rate);
    });
    
    // Calculate current due and total due
    const paidAmount = parseFloat(paid_amount) || 0;
    const currentDue = subtotal - paidAmount;
    const totalDue = previousDue + currentDue;
    
    // Insert transaction with ledger data (WhatsApp status = PENDING)
    const [result] = await pool.query(
      'INSERT INTO transactions (client_id, type, subtotal, paid_amount, current_due, previous_due, total_due, description, whatsapp_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [client_id, type, subtotal, paidAmount, currentDue, previousDue, totalDue, description || '', 'PENDING']
    );
    
    const transactionId = result.insertId;
    
    // Insert bill items
    for (const item of items) {
      const itemTotal = parseFloat(item.quantity) * parseFloat(item.rate);
      await pool.query(
        'INSERT INTO bill_items (transaction_id, item_name, quantity, rate, total_price) VALUES (?, ?, ?, ?, ?)',
        [transactionId, item.item_name, item.quantity, item.rate, itemTotal]
      );
    }

    // Update client balance with new total due
    await pool.query(
      'UPDATE clients SET balance = ? WHERE id = ?',
      [totalDue, client_id]
    );

    res.json({ 
      success: true, 
      message: 'Bill generated successfully',
      data: { 
        id: transactionId, 
        client_id, 
        type, 
        subtotal,
        paid_amount: paidAmount,
        current_due: currentDue,
        previous_due: previousDue,
        total_due: totalDue,
        whatsapp_status: 'PENDING'
      }
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update existing transaction (Edit Bill)
app.put('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { items, paid_amount, description } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'At least one item is required' 
    });
  }

  try {
    const pool = getPool();
    
    // Get current transaction to find client and old total_due
    const [currentTransaction] = await pool.query(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );
    
    if (currentTransaction.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }
    
    const transaction = currentTransaction[0];
    const clientId = transaction.client_id;
    const oldTotalDue = parseFloat(transaction.total_due) || 0;
    
    // Get client current balance
    const [clients] = await pool.query(
      'SELECT balance FROM clients WHERE id = ?',
      [clientId]
    );
    
    if (clients.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
    }
    
    const currentClientBalance = parseFloat(clients[0].balance) || 0;
    
    // Calculate new subtotal from updated items
    let newSubtotal = 0;
    items.forEach(item => {
      newSubtotal += parseFloat(item.quantity) * parseFloat(item.rate);
    });
    
    const paidAmount = parseFloat(paid_amount) || 0;
    const newCurrentDue = newSubtotal - paidAmount;
    const previousDue = parseFloat(transaction.previous_due) || 0;
    const newTotalDue = previousDue + newCurrentDue;
    
    // Calculate balance adjustment
    // Remove old total_due from client balance, add new total_due
    const adjustedBalance = currentClientBalance - oldTotalDue + newTotalDue;
    
    // Update transaction
    await pool.query(
      'UPDATE transactions SET subtotal = ?, paid_amount = ?, current_due = ?, total_due = ?, description = ? WHERE id = ?',
      [newSubtotal, paidAmount, newCurrentDue, newTotalDue, description || '', id]
    );
    
    // Delete old items
    await pool.query('DELETE FROM bill_items WHERE transaction_id = ?', [id]);
    
    // Insert updated items
    for (const item of items) {
      const itemTotal = parseFloat(item.quantity) * parseFloat(item.rate);
      await pool.query(
        'INSERT INTO bill_items (transaction_id, item_name, quantity, rate, total_price) VALUES (?, ?, ?, ?, ?)',
        [id, item.item_name, item.quantity, item.rate, itemTotal]
      );
    }
    
    // Update client balance
    await pool.query(
      'UPDATE clients SET balance = ? WHERE id = ?',
      [adjustedBalance, clientId]
    );
    
    res.json({ 
      success: true, 
      message: 'Bill updated successfully',
      data: {
        id,
        subtotal: newSubtotal,
        paid_amount: paidAmount,
        current_due: newCurrentDue,
        previous_due: previousDue,
        total_due: newTotalDue
      }
    });
    
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single transaction with details (for print)
app.get('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const pool = getPool();
    
    // Get transaction with client details
    const [transactions] = await pool.query(`
      SELECT t.*, c.name as client_name, c.phone as client_phone 
      FROM transactions t
      INNER JOIN clients c ON t.client_id = c.id
      WHERE t.id = ?
    `, [id]);
    
    if (transactions.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }
    
    const transaction = transactions[0];
    
    // Get bill items
    const [items] = await pool.query(
      'SELECT * FROM bill_items WHERE transaction_id = ?',
      [id]
    );
    
    transaction.items = items;
    
    // Get settings
    const [settingsRows] = await pool.query('SELECT * FROM settings LIMIT 1');
    transaction.settings = settingsRows.length > 0 ? settingsRows[0] : {
      business_name: 'Sajib Digital hub',
      business_phone: '',
      business_address: '',
      header_text: 'ধন্যবাদ আমাদের সেবা নেওয়ার জন্য',
      footer_text: 'আবার আসবেন 🙏'
    };
    
    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update existing transaction (Edit Bill)
app.put('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { items, paid_amount, description } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'At least one item is required' 
    });
  }

  try {
    const pool = getPool();
    
    // Get current transaction to find client and old total_due
    const [currentTransaction] = await pool.query(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );
    
    if (currentTransaction.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }
    
    const transaction = currentTransaction[0];
    const clientId = transaction.client_id;
    const oldTotalDue = parseFloat(transaction.total_due) || 0;
    
    // Get client current balance
    const [clients] = await pool.query(
      'SELECT balance FROM clients WHERE id = ?',
      [clientId]
    );
    
    if (clients.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
    }
    
    const currentClientBalance = parseFloat(clients[0].balance) || 0;
    
    // Calculate new subtotal from updated items
    let newSubtotal = 0;
    items.forEach(item => {
      newSubtotal += parseFloat(item.quantity) * parseFloat(item.rate);
    });
    
    const paidAmount = parseFloat(paid_amount) || 0;
    const newCurrentDue = newSubtotal - paidAmount;
    const previousDue = parseFloat(transaction.previous_due) || 0;
    const newTotalDue = previousDue + newCurrentDue;
    
    // Calculate balance adjustment
    // Remove old total_due from client balance, add new total_due
    const adjustedBalance = currentClientBalance - oldTotalDue + newTotalDue;
    
    // Update transaction
    await pool.query(
      'UPDATE transactions SET subtotal = ?, paid_amount = ?, current_due = ?, total_due = ?, description = ? WHERE id = ?',
      [newSubtotal, paidAmount, newCurrentDue, newTotalDue, description || '', id]
    );
    
    // Delete old items
    await pool.query('DELETE FROM bill_items WHERE transaction_id = ?', [id]);
    
    // Insert updated items
    for (const item of items) {
      const itemTotal = parseFloat(item.quantity) * parseFloat(item.rate);
      await pool.query(
        'INSERT INTO bill_items (transaction_id, item_name, quantity, rate, total_price) VALUES (?, ?, ?, ?, ?)',
        [id, item.item_name, item.quantity, item.rate, itemTotal]
      );
    }
    
    // Update client balance
    await pool.query(
      'UPDATE clients SET balance = ? WHERE id = ?',
      [adjustedBalance, clientId]
    );
    
    res.json({ 
      success: true, 
      message: 'Bill updated successfully',
      data: {
        id,
        subtotal: newSubtotal,
        paid_amount: paidAmount,
        current_due: newCurrentDue,
        previous_due: previousDue,
        total_due: newTotalDue
      }
    });
    
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send WhatsApp for existing transaction
app.post('/api/transactions/:id/send-whatsapp', async (req, res) => {
  const { id } = req.params;
  
  if (!isWhatsAppReady) {
    return res.status(503).json({ 
      success: false, 
      message: 'WhatsApp is not connected. Please scan QR code in Admin Settings.' 
    });
  }
  
  try {
    const pool = getPool();
    
    // Get transaction with all details
    const [transactions] = await pool.query(`
      SELECT t.*, c.name as client_name, c.phone as client_phone 
      FROM transactions t
      INNER JOIN clients c ON t.client_id = c.id
      WHERE t.id = ?
    `, [id]);
    
    if (transactions.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }
    
    const transaction = transactions[0];
    
    // Get bill items
    const [items] = await pool.query(
      'SELECT * FROM bill_items WHERE transaction_id = ?',
      [id]
    );
    
    // Get settings
    const [settingsRows] = await pool.query('SELECT * FROM settings LIMIT 1');
    const settings = settingsRows.length > 0 ? settingsRows[0] : {
      business_name: 'Sajib Digital hub',
      business_phone: '',
      business_address: '',
      header_text: 'ধন্যবাদ আমাদের সেবা নেওয়ার জন্য',
      footer_text: 'আবার আসবেন 🙏'
    };
    
    // Send WhatsApp
    const whatsappStatus = await sendWhatsAppBill(
      { 
        name: transaction.client_name, 
        phone: transaction.client_phone 
      },
      items,
      { 
        subtotal: parseFloat(transaction.subtotal), 
        paidAmount: parseFloat(transaction.paid_amount), 
        currentDue: parseFloat(transaction.current_due), 
        previousDue: parseFloat(transaction.previous_due),
        totalDue: parseFloat(transaction.total_due)
      },
      settings
    );
    
    // Update WhatsApp status in database
    await pool.query(
      'UPDATE transactions SET whatsapp_status = ? WHERE id = ?',
      [whatsappStatus, id]
    );
    
    res.json({ 
      success: true, 
      message: whatsappStatus === 'SENT' ? 'Bill sent via WhatsApp successfully' : 'Failed to send WhatsApp message',
      whatsappStatus
    });
    
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    
    // Update status to FAILED
    try {
      const pool = getPool();
      await pool.query(
        'UPDATE transactions SET whatsapp_status = ? WHERE id = ?',
        ['FAILED', id]
      );
    } catch (dbError) {
      console.error('Error updating WhatsApp status:', dbError);
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message,
      whatsappStatus: 'FAILED'
    });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize and start server
async function startServer() {
  try {
    // Auto-configure database and tables (fully automated for XAMPP)
    await autoConfigureDatabase();
    
    // Initialize trial system
    console.log('🔄 Initializing trial system...');
    await initializeTrialSystem();
    
    // Check system status
    console.log('🔄 Checking system status...');
    const trial = await getTrialStatus();
    const machine = getMachineId();
    const license = validateLicense(
      LICENSE_CONFIG.licenseKey,
      LICENSE_CONFIG.clientName,
      LICENSE_CONFIG.expiryDate
    );
    
    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║           SYSTEM STATUS - Sajib Digital Hub       ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');
    
    console.log('Machine Information:');
    console.log('─────────────────────────────────────────────────');
    console.log(`Machine ID:  ${machine.machineId}`);
    console.log(`Hostname:    ${machine.components.hostname || 'Unknown'}`);
    console.log(`Platform:    ${machine.components.platform || 'Unknown'}`);
    console.log('');
    
    // Display status based on trial/license
    if (trial.isActivated && license.valid) {
      console.log('✅ LICENSE STATUS: ACTIVATED');
      console.log('─────────────────────────────────────────────────');
      console.log(`Client Name:  ${LICENSE_CONFIG.clientName}`);
      console.log(`License Key:  ${LICENSE_CONFIG.licenseKey}`);
      console.log(`Expiry Date:  ${LICENSE_CONFIG.expiryDate}`);
      console.log(`Days Left:    ${license.daysRemaining} days`);
      
      if (license.daysRemaining <= 7) {
        console.log(`⚠️  WARNING: License expiring soon!`);
      }
    } else if (trial.trialExpired) {
      console.log('🔒 TRIAL STATUS: EXPIRED');
      console.log('─────────────────────────────────────────────────');
      console.log(`Trial Ended:  ${new Date(trial.expiredAt).toLocaleDateString('bn-BD')}`);
      console.log(`Days Expired: ${trial.daysExpired} days ago`);
      console.log('');
      console.log('❌ System is LOCKED - License activation required!');
      console.log('');
      console.log('📞 Contact for license:');
      console.log('   WhatsApp: 01739354392');
      console.log('   Facebook: @sajibrasel2');
    } else if (trial.isTrialActive) {
      console.log('🎁 TRIAL STATUS: ACTIVE');
      console.log('─────────────────────────────────────────────────');
      console.log(`Days Remaining: ${trial.daysRemaining} / 15 days`);
      console.log(`Days Used:      ${trial.daysUsed} days`);
      console.log(`Expires On:     ${new Date(trial.trialExpires).toLocaleDateString('bn-BD')}`);
      
      if (trial.showWarning) {
        console.log('');
        console.log(`⚠️  WARNING: Trial expiring soon! Upgrade now.`);
      }
    } else if (trial.trialAvailable) {
      console.log('✨ TRIAL AVAILABLE: 15-Day Free Trial');
      console.log('─────────────────────────────────────────────────');
      console.log('Start your free trial from the dashboard!');
      console.log('Or run: node trial_system.js start-trial');
    } else {
      console.log('❓ UNKNOWN STATUS');
      console.log('─────────────────────────────────────────────────');
      console.log(trial.message || 'Please contact support');
    }
    
    console.log('\n╚═══════════════════════════════════════════════════╝\n');
    
    // Initialize WhatsApp client
    console.log('🔄 Initializing WhatsApp client...');
    initializeWhatsApp();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Dashboard: http://localhost:${PORT}`);
      console.log(`\n⚠️  Please scan the QR code in the Admin Panel or terminal to authenticate WhatsApp\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  if (whatsappClient) {
    try {
      await whatsappClient.destroy();
      console.log('✅ WhatsApp client closed');
    } catch (error) {
      console.error('Error closing WhatsApp:', error);
    }
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Received SIGTERM, shutting down...');
  if (whatsappClient) {
    try {
      await whatsappClient.destroy();
      console.log('✅ WhatsApp client closed');
    } catch (error) {
      console.error('Error closing WhatsApp:', error);
    }
  }
  process.exit(0);
});

// Start the application
startServer();
