// Master Admin Panel JavaScript
// Developer: Sajib Digital Hub

// Admin credentials (encrypted in real production)
const ADMIN_CREDENTIALS = {
  email: 'raselsajib25@gmail.com',
  password: '12345Sajibs6@'
};

// Client database (stored in localStorage for demo)
let clientsDatabase = JSON.parse(localStorage.getItem('clientsDatabase')) || [];

// Login Handler
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    // Success
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    
    // Store session
    sessionStorage.setItem('adminLoggedIn', 'true');
    
    // Load dashboard
    loadDashboard();
    
    showToast('Welcome back, Sajib!', 'success');
  } else {
    showToast('Invalid credentials!', 'error');
  }
});

// Check if already logged in
if (sessionStorage.getItem('adminLoggedIn') === 'true') {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminDashboard').classList.remove('hidden');
  loadDashboard();
}

// Logout
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
  }
}

// Load Dashboard
function loadDashboard() {
  loadClients();
  updateStats();
}

// Update Stats
function updateStats() {
  const totalClients = clientsDatabase.length;
  const today = new Date();
  
  const activeLicenses = clientsDatabase.filter(client => {
    const expiry = new Date(client.expiryDate);
    return expiry > today;
  }).length;
  
  const expiringSoon = clientsDatabase.filter(client => {
    const expiry = new Date(client.expiryDate);
    const daysRemaining = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 && daysRemaining <= 15;
  }).length;
  
  const monthlyRevenue = clientsDatabase.reduce((sum, client) => {
    return sum + (client.price || 0);
  }, 0);
  
  document.getElementById('totalClients').textContent = totalClients;
  document.getElementById('activeLicenses').textContent = activeLicenses;
  document.getElementById('expiringSoon').textContent = expiringSoon;
  document.getElementById('monthlyRevenue').textContent = `৳${monthlyRevenue.toLocaleString()}`;
}

// Load Clients Table
function loadClients() {
  const tbody = document.getElementById('clientsTableBody');
  
  if (clientsDatabase.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-4 py-8 text-center text-gray-500">
          <i class="fas fa-inbox text-4xl mb-3 block"></i>
          <p class="font-semibold">No clients yet</p>
          <p class="text-sm">Generate your first license to get started</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = '';
  
  clientsDatabase.forEach((client, index) => {
    const row = document.createElement('tr');
    row.className = 'border-b hover:bg-purple-50 transition';
    
    // Calculate status
    const expiry = new Date(client.expiryDate);
    const today = new Date();
    const daysRemaining = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    
    let statusBadge;
    if (daysRemaining < 0) {
      statusBadge = '<span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Expired</span>';
    } else if (daysRemaining <= 7) {
      statusBadge = '<span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">Expiring Soon</span>';
    } else if (daysRemaining <= 15) {
      statusBadge = '<span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Active (Warning)</span>';
    } else {
      statusBadge = '<span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>';
    }
    
    row.innerHTML = `
      <td class="px-4 py-3">
        <div class="font-semibold text-gray-900">${client.clientName}</div>
        ${client.phone ? `<div class="text-xs text-gray-500">${client.phone}</div>` : ''}
      </td>
      <td class="px-4 py-3">
        <code class="text-xs bg-gray-100 px-2 py-1 rounded">${client.licenseKey}</code>
      </td>
      <td class="px-4 py-3 text-sm text-gray-600">
        ${new Date(client.issueDate).toLocaleDateString('en-GB')}
      </td>
      <td class="px-4 py-3 text-sm text-gray-600">
        ${new Date(client.expiryDate).toLocaleDateString('en-GB')}
        <div class="text-xs ${daysRemaining < 0 ? 'text-red-600' : 'text-gray-500'}">
          ${daysRemaining < 0 ? `Expired ${Math.abs(daysRemaining)} days ago` : `${daysRemaining} days left`}
        </div>
      </td>
      <td class="px-4 py-3">
        ${statusBadge}
      </td>
      <td class="px-4 py-3">
        <button onclick="viewClientDetails(${index})" class="text-blue-600 hover:text-blue-800 mr-2" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
        <button onclick="renewClient(${index})" class="text-green-600 hover:text-green-800 mr-2" title="Renew">
          <i class="fas fa-sync-alt"></i>
        </button>
        <button onclick="deleteClient(${index})" class="text-red-600 hover:text-red-800" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    
    tbody.appendChild(row);
  });
}

// Search Clients
function searchClients() {
  const searchTerm = document.getElementById('searchClient').value.toLowerCase();
  const rows = document.querySelectorAll('#clientsTableBody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Generate License Modal
function openGenerateLicenseModal() {
  document.getElementById('generateLicenseModal').classList.remove('hidden');
}

function closeGenerateLicenseModal() {
  document.getElementById('generateLicenseModal').classList.add('hidden');
  document.getElementById('generateLicenseForm').reset();
}

// Generate License Form Submit
document.getElementById('generateLicenseForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const clientName = document.getElementById('newClientName').value;
  const duration = parseInt(document.getElementById('newLicenseDuration').value);
  const phone = document.getElementById('newClientPhone').value;
  
  // Calculate price
  const priceMap = { 1: 500, 3: 1200, 6: 2000, 12: 3000 };
  const price = priceMap[duration];
  
  // Generate license key
  const licenseKey = generateLicenseKey(clientName);
  
  // Calculate expiry
  const issueDate = new Date();
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + duration);
  
  // Create client object
  const newClient = {
    clientName,
    licenseKey,
    issueDate: issueDate.toISOString().split('T')[0],
    expiryDate: expiryDate.toISOString().split('T')[0],
    duration: `${duration} month(s)`,
    price,
    phone: phone || '',
    status: 'Active'
  };
  
  // Add to database
  clientsDatabase.push(newClient);
  localStorage.setItem('clientsDatabase', JSON.stringify(clientsDatabase));
  
  // Close modal
  closeGenerateLicenseModal();
  
  // Show details
  showLicenseDetails(newClient);
  
  // Reload
  loadDashboard();
  
  showToast('License generated successfully!', 'success');
});

// Generate License Key
function generateLicenseKey(clientName) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  const hash = btoa(clientName + timestamp).substring(0, 8).toUpperCase();
  return `SAJIB-${hash}-${random.toUpperCase()}`;
}

// Show License Details
function showLicenseDetails(client) {
  document.getElementById('detailClientName').textContent = client.clientName;
  document.getElementById('detailExpiryDate').textContent = new Date(client.expiryDate).toLocaleDateString('en-GB');
  document.getElementById('detailLicenseKey').textContent = client.licenseKey;
  
  // Generate message
  const message = `🎉 আসসালামু আলাইকুম ${client.clientName},

আপনার POS Billing System এর License সফলভাবে তৈরি হয়েছে!

╔═══════════════════════════════════════╗
║       📋 LICENSE INFORMATION          ║
╚═══════════════════════════════════════╝

👤 Client Name: ${client.clientName}
🔑 License Key: ${client.licenseKey}
📅 Expiry Date: ${new Date(client.expiryDate).toLocaleDateString('en-GB')}
⏳ Duration: ${client.duration}
💰 Price: ৳${client.price}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️ INSTALLATION GUIDE (সাবধানে পড়ুন):

📂 Step 1: POS System folder খুলুন
   (যেখানে software install করেছেন)

📄 Step 2: .env ফাইল খুঁজে বের করুন
   • ফাইলটি লুকানো থাকতে পারে
   • Windows এ: View → Show → Hidden items চেক করুন
   • ফাইল না থাকলে Notepad এ তৈরি করুন

✏️ Step 3: .env ফাইল Notepad দিয়ে খুলুন

📝 Step 4: নিচের 3টি line খুঁজে পরিবর্তন করুন:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before (পুরাতন):
LICENSE_CLIENT_NAME=Demo User
LICENSE_KEY=DEMO-KEY-EXPIRES-SOON
LICENSE_EXPIRY=2025-01-31

After (নতুন - নিচের lines copy করুন):
LICENSE_CLIENT_NAME=${client.clientName}
LICENSE_KEY=${client.licenseKey}
LICENSE_EXPIRY=${client.expiryDate}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ সতর্কতা:
• = চিহ্নের আগে-পরে কোন space দিবেন না
• License key এর spelling ঠিক রাখুন
• তারিখ YYYY-MM-DD format এ আছে কিনা চেক করুন

💾 Step 5: File Save করুন (Ctrl+S চাপুন)

🔄 Step 6: Server Restart করুন
   • Command Prompt খুলুন
   • POS folder এ যান
   • Ctrl+C চেপে server বন্ধ করুন
   • আবার চালান: node server.js

✅ Step 7: যাচাই করুন
   Terminal এ দেখবেন:
   ✅ LICENSE VALID
      Client: ${client.clientName}
      Expires: ${new Date(client.expiryDate).toLocaleDateString('en-GB')}

🌐 Browser এ যান: http://localhost:3000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 গুরুত্বপূর্ণ নোট:
• License key টি সংরক্ষণ করে রাখুন
• মেয়াদ শেষ হওয়ার 7 দিন আগে warning পাবেন
• Renewal করতে চাইলে যোগাযোগ করুন

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆘 সমস্যা হলে যোগাযোগ করুন:

📱 WhatsApp: 01739354392
💬 Facebook: fb.com/sajibrasel2
📧 Email: raselsajib25@gmail.com

📹 Video Tutorial চাইলে বলুন পাঠিয়ে দিব।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Sajib Digital Hub ✨
Making Business Easy with Technology

© 2024-2026 | Made with ❤️ in Bangladesh

আপনার ব্যবসার সফলতা কামনা করছি! 🚀`;

  
  document.getElementById('clientMessage').value = message;
  document.getElementById('licenseDetailsModal').classList.remove('hidden');
}

function closeLicenseDetailsModal() {
  document.getElementById('licenseDetailsModal').classList.add('hidden');
}

// Copy to Clipboard
function copyToClipboard() {
  const message = document.getElementById('clientMessage');
  message.select();
  document.execCommand('copy');
  showToast('Message copied to clipboard!', 'success');
}

// View Client Details
function viewClientDetails(index) {
  const client = clientsDatabase[index];
  showLicenseDetails(client);
}

// Renew Client
function renewClient(index) {
  const client = clientsDatabase[index];
  const months = prompt(`Renew license for ${client.clientName}\n\nEnter months (1, 3, 6, or 12):`, '1');
  
  if (months && !isNaN(months)) {
    const duration = parseInt(months);
    const priceMap = { 1: 500, 3: 1200, 6: 2000, 12: 3000 };
    const price = priceMap[duration] || duration * 500;
    
    // Update expiry
    const newExpiry = new Date(client.expiryDate);
    newExpiry.setMonth(newExpiry.getMonth() + duration);
    
    client.expiryDate = newExpiry.toISOString().split('T')[0];
    client.price = price;
    
    // Save
    localStorage.setItem('clientsDatabase', JSON.stringify(clientsDatabase));
    
    // Show details
    showLicenseDetails(client);
    
    // Reload
    loadDashboard();
    
    showToast(`License renewed for ${duration} month(s)`, 'success');
  }
}

// Delete Client
function deleteClient(index) {
  const client = clientsDatabase[index];
  
  if (confirm(`Are you sure you want to delete ${client.clientName}?\n\nThis action cannot be undone!`)) {
    clientsDatabase.splice(index, 1);
    localStorage.setItem('clientsDatabase', JSON.stringify(clientsDatabase));
    loadDashboard();
    showToast('Client deleted successfully', 'success');
  }
}

// Renew License Modal (for bulk)
function openRenewLicenseModal() {
  alert('Select a client from the table and click the Renew button');
}

// View All Clients
function viewAllClients() {
  window.scrollTo({ top: document.getElementById('clientsTableBody').offsetTop - 100, behavior: 'smooth' });
}

// Toast Notification
function showToast(message, type = 'success') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-2xl z-50 fade-in`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Auto-refresh stats every 30 seconds
setInterval(updateStats, 30000);
