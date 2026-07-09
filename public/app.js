// API Base URL
const API_URL = window.location.origin;

// Global state
let billItems = [];
let allClients = [];
let allTransactions = [];
let currentClientPreviousDue = 0; // Store selected client's previous due
let currentGeneratedTransaction = null; // Store generated transaction for send/print
let editBillItems = []; // Store items while editing bill

// Toast Notification System
function showToast(title, message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastContent = document.getElementById('toastContent');
  const toastIcon = document.getElementById('toastIcon');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');

  const config = {
    success: {
      bg: 'bg-green-500',
      icon: 'fas fa-check-circle text-white'
    },
    error: {
      bg: 'bg-red-500',
      icon: 'fas fa-exclamation-circle text-white'
    },
    info: {
      bg: 'bg-blue-500',
      icon: 'fas fa-info-circle text-white'
    },
    warning: {
      bg: 'bg-yellow-500',
      icon: 'fas fa-exclamation-triangle text-white'
    }
  };

  const style = config[type] || config.success;
  
  toastContent.className = `rounded-lg shadow-2xl px-6 py-4 flex items-center space-x-3 min-w-[300px] ${style.bg} text-white`;
  toastIcon.className = style.icon;
  toastTitle.textContent = title;
  toastMessage.textContent = message;

  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 4000);
}

// Tab Switching
function switchTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('[id^="tab-"]').forEach(tab => {
    tab.classList.remove('tab-active');
    tab.classList.add('tab-inactive');
  });
  
  // Show selected tab content
  document.getElementById(`content-${tabName}`).classList.remove('hidden');
  
  // Add active class to selected tab
  document.getElementById(`tab-${tabName}`).classList.add('tab-active');
  document.getElementById(`tab-${tabName}`).classList.remove('tab-inactive');
  
  // Load data based on tab
  if (tabName === 'dashboard') {
    loadDashboardStats();
    loadTransactions();
  } else if (tabName === 'createBill') {
    loadClients();
    if (billItems.length === 0) {
      resetBillForm(); // Reset form when entering
    }
  } else if (tabName === 'clients') {
    loadClients();
  } else if (tabName === 'settings') {
    loadSettings();
    checkWhatsAppStatusDetailed();
  }
}

// Check WhatsApp Status (Header)
async function checkWhatsAppStatus() {
  try {
    const response = await fetch(`${API_URL}/api/whatsapp/status`);
    const data = await response.json();
    
    const statusDiv = document.getElementById('whatsappStatus');
    
    if (data.ready) {
      statusDiv.innerHTML = `
        <div class="h-3 w-3 bg-green-500 rounded-full"></div>
        <span class="text-sm font-medium text-green-700">WhatsApp Connected</span>
      `;
      statusDiv.className = 'flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200';
    } else {
      statusDiv.innerHTML = `
        <div class="animate-pulse h-3 w-3 bg-red-500 rounded-full"></div>
        <span class="text-sm font-medium text-red-700">WhatsApp Disconnected</span>
      `;
      statusDiv.className = 'flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200';
    }
  } catch (error) {
    console.error('Error checking WhatsApp status:', error);
  }
}

// Check WhatsApp Status Detailed (Settings Tab)
async function checkWhatsAppStatusDetailed() {
  try {
    const response = await fetch(`${API_URL}/api/whatsapp/status`);
    const data = await response.json();
    
    const statusDiv = document.getElementById('whatsappConnectionStatus');
    const qrContainer = document.getElementById('whatsappQRContainer');
    
    if (data.ready) {
      statusDiv.innerHTML = `
        <div class="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="h-4 w-4 bg-green-500 rounded-full"></div>
          <div>
            <p class="text-green-800 font-medium">✅ WhatsApp Connected & Ready</p>
            <p class="text-xs text-green-600">Bills will be sent automatically via WhatsApp</p>
          </div>
        </div>
      `;
      qrContainer.classList.add('hidden');
    } else {
      statusDiv.innerHTML = `
        <div class="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="h-4 w-4 bg-red-500 rounded-full animate-pulse"></div>
          <div>
            <p class="text-red-800 font-medium">❌ WhatsApp Disconnected</p>
            <p class="text-xs text-red-600">Scan the QR code below to connect</p>
          </div>
        </div>
      `;
      
      if (data.qrCode) {
        document.getElementById('whatsappQRImage').src = data.qrCode;
        qrContainer.classList.remove('hidden');
      } else {
        qrContainer.classList.add('hidden');
      }
    }
  } catch (error) {
    console.error('Error checking WhatsApp status:', error);
  }
}

// Load Settings
async function loadSettings() {
  try {
    const response = await fetch(`${API_URL}/api/settings`);
    const data = await response.json();
    
    if (data.success) {
      const settings = data.data;
      document.getElementById('businessName').value = settings.business_name || 'Sajib Digital hub';
      document.getElementById('businessPhone').value = settings.business_phone || '';
      document.getElementById('businessAddress').value = settings.business_address || '';
      document.getElementById('headerText').value = settings.header_text || 'ধন্যবাদ আমাদের সেবা নেওয়ার জন্য';
      document.getElementById('footerText').value = settings.footer_text || 'আবার আসবেন 🙏';
      
      // Update header
      document.getElementById('businessNameHeader').textContent = settings.business_name || 'Professional Edition';
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Save Settings
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const settingsData = {
    business_name: document.getElementById('businessName').value.trim(),
    business_phone: document.getElementById('businessPhone').value.trim(),
    business_address: document.getElementById('businessAddress').value.trim(),
    header_text: document.getElementById('headerText').value.trim(),
    footer_text: document.getElementById('footerText').value.trim()
  };
  
  try {
    const response = await fetch(`${API_URL}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Success', 'Settings updated successfully', 'success');
      document.getElementById('businessNameHeader').textContent = settingsData.business_name;
    } else {
      showToast('Error', data.message || 'Failed to update settings', 'error');
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    showToast('Error', 'Network error occurred', 'error');
  }
});

// Load Clients
async function loadClients() {
  try {
    const response = await fetch(`${API_URL}/api/clients`);
    const data = await response.json();
    
    if (data.success) {
      allClients = data.data;
      
      // Update all client dropdowns
      const selectors = ['billClientPOS'];
      selectors.forEach(selectorId => {
        const select = document.getElementById(selectorId);
        if (select) {
          select.innerHTML = '<option value="">-- Choose Client --</option>';
          data.data.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.name} (${client.phone})`;
            option.dataset.phone = client.phone;
            option.dataset.name = client.name;
            option.dataset.balance = client.balance;
            select.appendChild(option);
          });
          
          // Add change event listener to fetch previous due
          select.removeEventListener('change', onClientSelect);
          select.addEventListener('change', onClientSelect);
        }
      });
      
      // Update clients table
      updateClientsTable(data.data);
    }
  } catch (error) {
    console.error('Error loading clients:', error);
    showToast('Error', 'Failed to load clients', 'error');
  }
}

// Update Clients Table
function updateClientsTable(clients) {
  const tbody = document.getElementById('clientsTableBody');
  
  if (!tbody) return;
  
  if (clients.length > 0) {
    tbody.innerHTML = '';
    
    clients.forEach(client => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition';
      
      const date = new Date(client.created_at);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      
      const balanceColor = client.balance >= 0 ? 'text-green-600' : 'text-red-600';
      
      row.innerHTML = `
        <td class="px-4 py-3 font-medium text-gray-900">${client.name}</td>
        <td class="px-4 py-3 text-gray-600">${client.phone}</td>
        <td class="px-4 py-3 font-semibold ${balanceColor}">৳${parseFloat(client.balance).toFixed(2)}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${formattedDate}</td>
        <td class="px-4 py-3">
          <button onclick="viewClientStatement(${client.id}, '${client.name.replace(/'/g, "\\'")}', '${client.phone}')" class="text-purple-600 hover:text-purple-800 mr-3" title="Statement">
            <i class="fas fa-file-invoice"></i>
          </button>
          <button onclick="editClient(${client.id}, '${client.name.replace(/'/g, "\\'")}', '${client.phone}')" class="text-blue-600 hover:text-blue-800 mr-3" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteClient(${client.id}, '${client.name.replace(/'/g, "\\'")}')" class="text-red-600 hover:text-red-800" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      tbody.appendChild(row);
    });
  } else {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-4 py-8 text-center text-gray-500">
          <i class="fas fa-inbox text-3xl mb-2 block"></i>
          <p>No clients found</p>
        </td>
      </tr>
    `;
  }
}

// Add Client (Tab)
document.getElementById('addClientFormTab').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('clientNameTab').value.trim();
  const phone = document.getElementById('clientPhoneTab').value.trim();
  
  if (!name || !phone) {
    showToast('Validation Error', 'Please fill all fields', 'warning');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Success', 'Client added successfully', 'success');
      document.getElementById('addClientFormTab').reset();
      loadClients();
    } else {
      showToast('Error', data.message || 'Failed to add client', 'error');
    }
  } catch (error) {
    console.error('Error adding client:', error);
    showToast('Error', 'Network error occurred', 'error');
  }
});

// Edit Client
function editClient(id, name, phone) {
  document.getElementById('editClientId').value = id;
  document.getElementById('editClientName').value = name;
  document.getElementById('editClientPhone').value = phone;
  document.getElementById('editClientModal').classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('editClientModal').classList.add('hidden');
}

document.getElementById('editClientForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('editClientId').value;
  const name = document.getElementById('editClientName').value.trim();
  const phone = document.getElementById('editClientPhone').value.trim();
  
  try {
    const response = await fetch(`${API_URL}/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Success', 'Client updated successfully', 'success');
      closeEditModal();
      loadClients();
    } else {
      showToast('Error', data.message || 'Failed to update client', 'error');
    }
  } catch (error) {
    console.error('Error updating client:', error);
    showToast('Error', 'Network error occurred', 'error');
  }
});

// Delete Client
async function deleteClient(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/clients/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Success', 'Client deleted successfully', 'success');
      loadClients();
    } else {
      showToast('Error', data.message || 'Failed to delete client', 'error');
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    showToast('Error', 'Network error occurred', 'error');
  }
}

// Bill Items Management
function addBillItem() {
  const container = document.getElementById('billItemsContainer');
  const itemId = Date.now();
  
  const itemDiv = document.createElement('div');
  itemDiv.className = 'grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200';
  itemDiv.id = `item-${itemId}`;
  
  itemDiv.innerHTML = `
    <div class="col-span-5">
      <input type="text" placeholder="Item name" class="item-name w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm" required onchange="updateSummary()">
    </div>
    <div class="col-span-2">
      <input type="number" placeholder="Qty" min="1" value="1" class="item-qty w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm" required onchange="updateSummary()">
    </div>
    <div class="col-span-3">
      <input type="number" placeholder="Rate" min="0" step="0.01" class="item-rate w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm" required onchange="updateSummary()">
    </div>
    <div class="col-span-2 flex items-center justify-center">
      <button type="button" onclick="removeBillItem(${itemId})" class="text-red-600 hover:text-red-800">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  
  container.appendChild(itemDiv);
  billItems.push(itemId);
}

function removeBillItem(itemId) {
  const item = document.getElementById(`item-${itemId}`);
  if (item) {
    item.remove();
    billItems = billItems.filter(id => id !== itemId);
    updateSummary();
  }
}

// Update Bill Summary with Ledger Logic
function updateSummary() {
  const container = document.getElementById('billItemsContainer');
  const items = container.querySelectorAll('[id^="item-"]');
  
  let subtotal = 0;
  
  items.forEach(item => {
    const qty = parseFloat(item.querySelector('.item-qty').value) || 0;
    const rate = parseFloat(item.querySelector('.item-rate').value) || 0;
    subtotal += qty * rate;
  });
  
  const paidAmount = parseFloat(document.getElementById('billPaidAmount').value) || 0;
  const currentDue = subtotal - paidAmount;
  const previousDue = currentClientPreviousDue;
  const totalDue = previousDue + currentDue;
  
  document.getElementById('summarySubtotal').textContent = `৳${subtotal.toFixed(2)}`;
  document.getElementById('summaryCurrentDue').textContent = `৳${currentDue.toFixed(2)}`;
  document.getElementById('summaryPreviousDue').textContent = `৳${previousDue.toFixed(2)}`;
  document.getElementById('summaryTotalDue').textContent = `৳${totalDue.toFixed(2)}`;
}

// Handle client selection to fetch previous due
async function onClientSelect() {
  const clientId = document.getElementById('billClientPOS').value;
  
  if (!clientId) {
    currentClientPreviousDue = 0;
    updateSummary();
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/clients/${clientId}`);
    const data = await response.json();
    
    if (data.success) {
      currentClientPreviousDue = parseFloat(data.data.balance) || 0;
      updateSummary();
    }
  } catch (error) {
    console.error('Error fetching client balance:', error);
    currentClientPreviousDue = 0;
    updateSummary();
  }
}

// Create Bill Form Submit (Generate Only)
document.getElementById('createBillForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const clientId = document.getElementById('billClientPOS').value;
  const type = document.getElementById('billType').value;
  const paidAmount = parseFloat(document.getElementById('billPaidAmount').value) || 0;
  const notes = document.getElementById('billNotes').value.trim();
  
  if (!clientId) {
    showToast('Validation Error', 'Please select a client', 'warning');
    return;
  }
  
  // Collect items
  const container = document.getElementById('billItemsContainer');
  const itemElements = container.querySelectorAll('[id^="item-"]');
  
  const items = [];
  for (const item of itemElements) {
    const itemName = item.querySelector('.item-name').value.trim();
    const qty = parseInt(item.querySelector('.item-qty').value);
    const rate = parseFloat(item.querySelector('.item-rate').value);
    
    if (!itemName || qty <= 0 || rate < 0) {
      showToast('Validation Error', 'Please fill all item fields correctly', 'warning');
      return;
    }
    
    items.push({ item_name: itemName, quantity: qty, rate: rate });
  }
  
  if (items.length === 0) {
    showToast('Validation Error', 'Please add at least one item', 'warning');
    return;
  }
  
  // Disable generate button while processing
  const btnGenerate = document.getElementById('btnGenerate');
  const originalText = btnGenerate.innerHTML;
  btnGenerate.disabled = true;
  btnGenerate.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating...';
  
  try {
    const response = await fetch(`${API_URL}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: parseInt(clientId),
        type,
        items,
        paid_amount: paidAmount,
        description: notes
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Store transaction for send/print
      currentGeneratedTransaction = data.data;
      
      // Show success message
      showToast('Success', 'Bill generated successfully!', 'success');
      
      // Show transaction info
      document.getElementById('generatedTransactionId').textContent = `#${data.data.id}`;
      document.getElementById('billGeneratedInfo').classList.remove('hidden');
      
      // Enable Send WhatsApp and Print buttons
      document.getElementById('btnSendWhatsApp').disabled = false;
      document.getElementById('btnPrint').disabled = false;
      
      // Update button text to show it's already generated
      btnGenerate.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Generated';
      btnGenerate.disabled = true;
      
      // Reload transactions in dashboard
      loadTransactions();
      
    } else {
      showToast('Error', data.message || 'Failed to generate bill', 'error');
      btnGenerate.disabled = false;
      btnGenerate.innerHTML = originalText;
    }
  } catch (error) {
    console.error('Error generating bill:', error);
    showToast('Error', 'Network error occurred', 'error');
    btnGenerate.disabled = false;
    btnGenerate.innerHTML = originalText;
  }
});

// Send WhatsApp Button Click Handler
document.getElementById('btnSendWhatsApp').addEventListener('click', async () => {
  if (!currentGeneratedTransaction || !currentGeneratedTransaction.id) {
    showToast('Error', 'No bill generated yet', 'warning');
    return;
  }
  
  const btnSend = document.getElementById('btnSendWhatsApp');
  const originalText = btnSend.innerHTML;
  btnSend.disabled = true;
  btnSend.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
  
  try {
    const response = await fetch(`${API_URL}/api/transactions/${currentGeneratedTransaction.id}/send-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    
    if (data.success && data.whatsappStatus === 'SENT') {
      showToast('Success', 'Bill sent via WhatsApp successfully!', 'success');
      btnSend.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Sent';
      
      // Update transaction status in memory
      if (currentGeneratedTransaction) {
        currentGeneratedTransaction.whatsapp_status = 'SENT';
      }
      
      // Reload transactions to show updated status
      loadTransactions();
      
    } else {
      showToast('Error', data.message || 'Failed to send WhatsApp message', 'error');
      btnSend.disabled = false;
      btnSend.innerHTML = originalText;
    }
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    showToast('Error', 'Network error occurred', 'error');
    btnSend.disabled = false;
    btnSend.innerHTML = originalText;
  }
});

// Print Button Click Handler
document.getElementById('btnPrint').addEventListener('click', async () => {
  if (!currentGeneratedTransaction || !currentGeneratedTransaction.id) {
    showToast('Error', 'No bill generated yet', 'warning');
    return;
  }
  
  const btnPrint = document.getElementById('btnPrint');
  const originalText = btnPrint.innerHTML;
  btnPrint.disabled = true;
  btnPrint.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Loading...';
  
  try {
    // Fetch full transaction details
    const response = await fetch(`${API_URL}/api/transactions/${currentGeneratedTransaction.id}`);
    const data = await response.json();
    
    if (data.success) {
      const transaction = data.data;
      const settings = transaction.settings;
      
      // Format date in Bengali
      const now = new Date(transaction.created_at);
      const date = now.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const time = now.toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Build items list
      let itemsHTML = '';
      transaction.items.forEach((item, index) => {
        itemsHTML += `
          <div class="flex justify-between text-sm py-1">
            <span>${index + 1}. ${item.item_name} (${item.quantity}x৳${parseFloat(item.rate).toFixed(2)})</span>
            <span class="font-bold">৳${parseFloat(item.total_price).toFixed(2)}</span>
          </div>
        `;
      });
      
      // Build receipt HTML
      const receiptHTML = `
        <div class="bg-white p-6 border-2 border-gray-800">
          <div class="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
            <h1 class="text-2xl font-bold mb-1">${settings.business_name}</h1>
            ${settings.business_phone ? `<p class="text-sm">📞 ${settings.business_phone}</p>` : ''}
            ${settings.business_address ? `<p class="text-xs text-gray-600 mt-1">${settings.business_address}</p>` : ''}
          </div>
          
          <div class="mb-4 text-sm">
            <div class="flex justify-between py-1">
              <span class="font-semibold">ক্লায়েন্ট:</span>
              <span>${transaction.client_name}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="font-semibold">মোবাইল:</span>
              <span>${transaction.client_phone}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="font-semibold">তারিখ:</span>
              <span>${date} ${time}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="font-semibold">বিল নং:</span>
              <span>#${transaction.id}</span>
            </div>
          </div>
          
          <div class="border-t-2 border-b-2 border-gray-400 py-3 mb-3">
            <h3 class="font-bold text-center mb-2">বিবরণ</h3>
            ${itemsHTML}
          </div>
          
          <div class="text-sm space-y-2 mb-4">
            <div class="flex justify-between font-semibold text-base">
              <span>মোট বিল:</span>
              <span>৳${parseFloat(transaction.subtotal).toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-green-700">
              <span>জমা প্রদান:</span>
              <span>৳${parseFloat(transaction.paid_amount).toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-orange-600">
              <span>বর্তমান বিলের বকেয়া:</span>
              <span>৳${parseFloat(transaction.current_due).toFixed(2)}</span>
            </div>
            <div class="border-t border-gray-300 pt-2"></div>
            <div class="flex justify-between text-gray-600">
              <span>পূর্বের বকেয়া:</span>
              <span>৳${parseFloat(transaction.previous_due).toFixed(2)}</span>
            </div>
            <div class="flex justify-between font-bold text-lg text-red-600 border-t-2 border-gray-400 pt-2">
              <span>সর্বমোট বকেয়া:</span>
              <span>৳${parseFloat(transaction.total_due).toFixed(2)}</span>
            </div>
          </div>
          
          ${settings.footer_text ? `
          <div class="text-center border-t-2 border-dashed border-gray-400 pt-4 text-sm">
            <p>${settings.footer_text}</p>
          </div>
          ` : ''}
          
          <div class="text-center mt-4 text-xs text-gray-500">
            <p>Powered by POS Billing System</p>
          </div>
        </div>
      `;
      
      // Populate print container
      document.getElementById('printReceipt').innerHTML = receiptHTML;
      
      // Trigger print
      window.print();
      
      btnPrint.disabled = false;
      btnPrint.innerHTML = originalText;
      
    } else {
      showToast('Error', 'Failed to load bill details', 'error');
      btnPrint.disabled = false;
      btnPrint.innerHTML = originalText;
    }
  } catch (error) {
    console.error('Error printing:', error);
    showToast('Error', 'Failed to print', 'error');
    btnPrint.disabled = false;
    btnPrint.innerHTML = originalText;
  }
});

// Reset form function (called when switching tabs or after completion)
function resetBillForm() {
  document.getElementById('createBillForm').reset();
  document.getElementById('billPaidAmount').value = '0';
  document.getElementById('billItemsContainer').innerHTML = '';
  billItems = [];
  currentClientPreviousDue = 0;
  currentGeneratedTransaction = null;
  
  // Reset buttons
  document.getElementById('btnGenerate').disabled = false;
  document.getElementById('btnGenerate').innerHTML = '<i class="fas fa-save mr-2"></i> জেনারেট করুন';
  document.getElementById('btnSendWhatsApp').disabled = true;
  document.getElementById('btnSendWhatsApp').innerHTML = '<i class="fab fa-whatsapp mr-2"></i> WhatsApp পাঠান';
  document.getElementById('btnPrint').disabled = true;
  document.getElementById('btnPrint').innerHTML = '<i class="fas fa-print mr-2"></i> প্রিন্ট করুন';
  
  // Hide generated info
  document.getElementById('billGeneratedInfo').classList.add('hidden');
  
  // Add first empty item
  addBillItem();
  updateSummary();
}

// Load Transactions
async function loadTransactions() {
  try {
    const response = await fetch(`${API_URL}/api/transactions`);
    const data = await response.json();
    
    if (data.success) {
      allTransactions = data.data;
      updateTransactionsTable(data.data);
    }
  } catch (error) {
    console.error('Error loading transactions:', error);
    showToast('Error', 'Failed to load transactions', 'error');
  }
}

// Update Transactions Table
function updateTransactionsTable(transactions) {
  const tbody = document.getElementById('transactionsTableBody');
  
  if (transactions.length > 0) {
    tbody.innerHTML = '';
    
    transactions.forEach(transaction => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition';
      
      const date = new Date(transaction.created_at);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const typeColors = {
        'INCOME': 'bg-green-100 text-green-800',
        'EXPENSE': 'bg-red-100 text-red-800',
        'DUE': 'bg-yellow-100 text-yellow-800'
      };
      
      const statusColors = {
        'SENT': 'bg-green-100 text-green-800',
        'FAILED': 'bg-red-100 text-red-800',
        'PENDING': 'bg-gray-100 text-gray-800'
      };
      
      const statusIcons = {
        'SENT': 'fa-check-circle',
        'FAILED': 'fa-times-circle',
        'PENDING': 'fa-clock'
      };
      
      // Items summary
      const itemsCount = transaction.items ? transaction.items.length : 0;
      const itemsList = transaction.items ? transaction.items.map(i => i.item_name).join(', ') : 'N/A';
      
      // Ledger data
      const subtotal = parseFloat(transaction.subtotal) || 0;
      const paidAmount = parseFloat(transaction.paid_amount) || 0;
      const currentDue = parseFloat(transaction.current_due) || 0;
      
      // Action buttons HTML
      const actionsHTML = `
        <button onclick="openEditBillModal(${transaction.id})" 
                class="text-blue-600 hover:text-blue-800 mr-2" 
                title="সংশোধন করুন (Edit)">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="resendWhatsApp(${transaction.id})" 
                class="text-green-600 hover:text-green-800 mr-2" 
                title="আবার পাঠান (Resend)">
          <i class="fab fa-whatsapp"></i>
        </button>
        <button onclick="printTransaction(${transaction.id})" 
                class="text-purple-600 hover:text-purple-800" 
                title="প্রিন্ট (Print)">
          <i class="fas fa-print"></i>
        </button>
      `;
      
      row.innerHTML = `
        <td class="px-4 py-3">
          <div class="font-medium text-gray-900">${transaction.client_name}</div>
          <div class="text-xs text-gray-500">${transaction.client_phone}</div>
        </td>
        <td class="px-4 py-3">
          <span class="px-2 py-1 text-xs font-semibold rounded-full ${typeColors[transaction.type]}">
            ${transaction.type}
          </span>
        </td>
        <td class="px-4 py-3">
          <div class="text-sm font-semibold text-gray-900">৳${subtotal.toFixed(2)}</div>
          <div class="text-xs text-green-600">জমা: ৳${paidAmount.toFixed(2)}</div>
          <div class="text-xs text-orange-600">বকেয়া: ৳${currentDue.toFixed(2)}</div>
        </td>
        <td class="px-4 py-3">
          <div class="text-sm text-gray-600">${itemsCount} item(s)</div>
          <div class="text-xs text-gray-400 truncate max-w-[150px]" title="${itemsList}">${itemsList}</div>
        </td>
        <td class="px-4 py-3">
          <span class="px-2 py-1 text-xs font-semibold rounded-full flex items-center space-x-1 w-fit ${statusColors[transaction.whatsapp_status]}">
            <i class="fas ${statusIcons[transaction.whatsapp_status]}"></i>
            <span>${transaction.whatsapp_status}</span>
          </span>
        </td>
        <td class="px-4 py-3">
          <div class="text-sm text-gray-900">${formattedDate}</div>
          <div class="text-xs text-gray-500">${formattedTime}</div>
        </td>
        <td class="px-4 py-3">
          ${actionsHTML}
        </td>
      `;
      
      tbody.appendChild(row);
    });
  } else {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-4 py-8 text-center text-gray-500">
          <i class="fas fa-inbox text-3xl mb-2 block"></i>
          <p>No transactions found</p>
        </td>
      </tr>
    `;
  }
}

// Load Dashboard Stats
async function loadDashboardStats() {
  try {
    // Load clients and transactions
    await Promise.all([loadClients(), loadTransactions()]);
    
    // Calculate stats - use subtotal for revenue
    const totalRevenue = allTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.subtotal || 0), 0);
    
    document.getElementById('totalRevenue').textContent = `৳${totalRevenue.toFixed(2)}`;
    document.getElementById('totalClients').textContent = allClients.length;
    document.getElementById('totalBills').textContent = allTransactions.length;
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  checkWhatsAppStatus();
  loadSettings();
  loadDashboardStats();
  
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  
  // Check WhatsApp status every 30 seconds
  setInterval(checkWhatsAppStatus, 30000);
  
  // Auto-refresh if on settings tab
  setInterval(() => {
    if (!document.getElementById('content-settings').classList.contains('hidden')) {
      checkWhatsAppStatusDetailed();
    }
  }, 5000);
});

// ============================================
// EDIT BILL FUNCTIONALITY
// ============================================

// Open Edit Bill Modal
async function openEditBillModal(transactionId) {
  try {
    // Fetch transaction details
    const response = await fetch(`${API_URL}/api/transactions/${transactionId}`);
    const data = await response.json();
    
    if (!data.success) {
      showToast('Error', 'Failed to load bill details', 'error');
      return;
    }
    
    const transaction = data.data;
    
    // Populate modal
    document.getElementById('editTransactionId').value = transaction.id;
    document.getElementById('editClientId').value = transaction.client_id;
    document.getElementById('editClientName').textContent = transaction.client_name;
    document.getElementById('editPreviousDue').textContent = `৳${parseFloat(transaction.previous_due).toFixed(2)}`;
    document.getElementById('editPaidAmount').value = parseFloat(transaction.paid_amount).toFixed(2);
    document.getElementById('editBillNotes').value = transaction.description || '';
    
    // Clear and populate items
    editBillItems = [];
    const container = document.getElementById('editBillItemsContainer');
    container.innerHTML = '';
    
    if (transaction.items && transaction.items.length > 0) {
      transaction.items.forEach(item => {
        addEditBillItem(item.item_name, item.quantity, item.rate);
      });
    } else {
      addEditBillItem(); // Add one empty item
    }
    
    // Calculate and show summary
    updateEditSummary();
    
    // Show modal
    document.getElementById('editBillModal').classList.remove('hidden');
    
  } catch (error) {
    console.error('Error opening edit modal:', error);
    showToast('Error', 'Failed to open edit form', 'error');
  }
}

// Close Edit Bill Modal
function closeEditBillModal() {
  document.getElementById('editBillModal').classList.add('hidden');
  editBillItems = [];
}

// Add item to edit bill form
function addEditBillItem(itemName = '', quantity = 1, rate = 0) {
  const container = document.getElementById('editBillItemsContainer');
  const itemId = Date.now();
  
  const itemDiv = document.createElement('div');
  itemDiv.className = 'grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200';
  itemDiv.id = `edit-item-${itemId}`;
  
  itemDiv.innerHTML = `
    <div class="col-span-5">
      <input type="text" value="${itemName}" placeholder="Item name" class="edit-item-name w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" required onchange="updateEditSummary()">
    </div>
    <div class="col-span-2">
      <input type="number" value="${quantity}" placeholder="Qty" min="1" class="edit-item-qty w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" required onchange="updateEditSummary()">
    </div>
    <div class="col-span-3">
      <input type="number" value="${rate}" placeholder="Rate" min="0" step="0.01" class="edit-item-rate w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" required onchange="updateEditSummary()">
    </div>
    <div class="col-span-2 flex items-center justify-center">
      <button type="button" onclick="removeEditBillItem(${itemId})" class="text-red-600 hover:text-red-800">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  
  container.appendChild(itemDiv);
  editBillItems.push(itemId);
}

// Remove item from edit bill form
function removeEditBillItem(itemId) {
  const item = document.getElementById(`edit-item-${itemId}`);
  if (item) {
    item.remove();
    editBillItems = editBillItems.filter(id => id !== itemId);
    updateEditSummary();
  }
}

// Update edit bill summary
function updateEditSummary() {
  const container = document.getElementById('editBillItemsContainer');
  const items = container.querySelectorAll('[id^="edit-item-"]');
  
  let subtotal = 0;
  
  items.forEach(item => {
    const qty = parseFloat(item.querySelector('.edit-item-qty').value) || 0;
    const rate = parseFloat(item.querySelector('.edit-item-rate').value) || 0;
    subtotal += qty * rate;
  });
  
  const paidAmount = parseFloat(document.getElementById('editPaidAmount').value) || 0;
  const previousDue = parseFloat(document.getElementById('editPreviousDue').textContent.replace('৳', '')) || 0;
  const currentDue = subtotal - paidAmount;
  const newTotalDue = previousDue + currentDue;
  
  document.getElementById('editNewTotalDue').textContent = `৳${newTotalDue.toFixed(2)}`;
}

// Submit edit bill form
document.getElementById('editBillForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const transactionId = document.getElementById('editTransactionId').value;
  const paidAmount = parseFloat(document.getElementById('editPaidAmount').value) || 0;
  const notes = document.getElementById('editBillNotes').value.trim();
  
  // Collect items
  const container = document.getElementById('editBillItemsContainer');
  const itemElements = container.querySelectorAll('[id^="edit-item-"]');
  
  const items = [];
  for (const item of itemElements) {
    const itemName = item.querySelector('.edit-item-name').value.trim();
    const qty = parseInt(item.querySelector('.edit-item-qty').value);
    const rate = parseFloat(item.querySelector('.edit-item-rate').value);
    
    if (!itemName || qty <= 0 || rate < 0) {
      showToast('Validation Error', 'Please fill all item fields correctly', 'warning');
      return;
    }
    
    items.push({ item_name: itemName, quantity: qty, rate: rate });
  }
  
  if (items.length === 0) {
    showToast('Validation Error', 'Please add at least one item', 'warning');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/transactions/${transactionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        paid_amount: paidAmount,
        description: notes
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Success', 'বিল সংশোধন হয়েছে! (Bill updated successfully)', 'success');
      closeEditBillModal();
      
      // Reload transactions and clients
      loadTransactions();
      loadClients();
      loadDashboardStats();
      
    } else {
      showToast('Error', data.message || 'Failed to update bill', 'error');
    }
  } catch (error) {
    console.error('Error updating bill:', error);
    showToast('Error', 'Network error occurred', 'error');
  }
});

// Resend WhatsApp message
async function resendWhatsApp(transactionId) {
  if (!confirm('আবার WhatsApp পাঠাতে চান? (Resend WhatsApp message?)')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/transactions/${transactionId}/send-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    
    if (data.success && data.whatsappStatus === 'SENT') {
      showToast('Success', 'WhatsApp পাঠানো হয়েছে! (Message sent successfully)', 'success');
      loadTransactions(); // Reload to update status
    } else {
      showToast('Error', data.message || 'Failed to send WhatsApp', 'error');
    }
  } catch (error) {
    console.error('Error resending WhatsApp:', error);
    showToast('Error', 'Network error occurred', 'error');
  }
}

// Print transaction from dashboard
async function printTransaction(transactionId) {
  // Use the same print logic as the print button
  const btnPrint = document.getElementById('btnPrint');
  if (btnPrint) {
    // Temporarily store transaction ID
    const tempTransaction = { id: transactionId };
    const originalTransaction = currentGeneratedTransaction;
    currentGeneratedTransaction = tempTransaction;
    
    // Trigger print
    await document.getElementById('btnPrint').click();
    
    // Restore original
    currentGeneratedTransaction = originalTransaction;
  } else {
    // Fallback: direct print logic
    try {
      const response = await fetch(`${API_URL}/api/transactions/${transactionId}`);
      const data = await response.json();
      
      if (data.success) {
        const transaction = data.data;
        const settings = transaction.settings;
        
        const now = new Date(transaction.created_at);
        const date = now.toLocaleDateString('bn-BD', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const time = now.toLocaleTimeString('bn-BD', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        let itemsHTML = '';
        transaction.items.forEach((item, index) => {
          itemsHTML += `
            <div class="flex justify-between text-sm py-1">
              <span>${index + 1}. ${item.item_name} (${item.quantity}x৳${parseFloat(item.rate).toFixed(2)})</span>
              <span class="font-bold">৳${parseFloat(item.total_price).toFixed(2)}</span>
            </div>
          `;
        });
        
        const receiptHTML = `
          <div class="bg-white p-6 border-2 border-gray-800">
            <div class="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
              <h1 class="text-2xl font-bold mb-1">${settings.business_name}</h1>
              ${settings.business_phone ? `<p class="text-sm">📞 ${settings.business_phone}</p>` : ''}
              ${settings.business_address ? `<p class="text-xs text-gray-600 mt-1">${settings.business_address}</p>` : ''}
            </div>
            
            <div class="mb-4 text-sm">
              <div class="flex justify-between py-1">
                <span class="font-semibold">ক্লায়েন্ট:</span>
                <span>${transaction.client_name}</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="font-semibold">মোবাইল:</span>
                <span>${transaction.client_phone}</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="font-semibold">তারিখ:</span>
                <span>${date} ${time}</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="font-semibold">বিল নং:</span>
                <span>#${transaction.id}</span>
              </div>
            </div>
            
            <div class="border-t-2 border-b-2 border-gray-400 py-3 mb-3">
              <h3 class="font-bold text-center mb-2">বিবরণ</h3>
              ${itemsHTML}
            </div>
            
            <div class="text-sm space-y-2 mb-4">
              <div class="flex justify-between font-semibold text-base">
                <span>মোট বিল:</span>
                <span>৳${parseFloat(transaction.subtotal).toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-green-700">
                <span>জমা প্রদান:</span>
                <span>৳${parseFloat(transaction.paid_amount).toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-orange-600">
                <span>বর্তমান বিলের বকেয়া:</span>
                <span>৳${parseFloat(transaction.current_due).toFixed(2)}</span>
              </div>
              <div class="border-t border-gray-300 pt-2"></div>
              <div class="flex justify-between text-gray-600">
                <span>পূর্বের বকেয়া:</span>
                <span>৳${parseFloat(transaction.previous_due).toFixed(2)}</span>
              </div>
              <div class="flex justify-between font-bold text-lg text-red-600 border-t-2 border-gray-400 pt-2">
                <span>সর্বমোট বকেয়া:</span>
                <span>৳${parseFloat(transaction.total_due).toFixed(2)}</span>
              </div>
            </div>
            
            ${settings.footer_text ? `
            <div class="text-center border-t-2 border-dashed border-gray-400 pt-4 text-sm">
              <p>${settings.footer_text}</p>
            </div>
            ` : ''}
            
            <div class="text-center mt-4 text-xs text-gray-500">
              <p>Powered by POS Billing System</p>
            </div>
          </div>
        `;
        
        document.getElementById('printReceipt').innerHTML = receiptHTML;
        window.print();
      }
    } catch (error) {
      console.error('Error printing:', error);
      showToast('Error', 'Failed to print', 'error');
    }
  }
}

// ═══════════════════════════════════════════════════════════
// UPGRADE / TRIAL / ACTIVATION FUNCTIONS
// ═══════════════════════════════════════════════════════════

// Load System Status (Trial/License/Activation)
async function loadSystemStatus() {
  try {
    const response = await fetch(`${API_URL}/api/system/status`);
    const data = await response.json();
    
    if (!data.success) {
      showToast('Error', 'Failed to load system status', 'error');
      return;
    }
    
    const { system, trial, license, machine } = data;
    
    // Update machine ID display
    document.getElementById('displayMachineId').textContent = machine.id || 'Unknown';
    
    // Update system status message
    document.getElementById('systemStatusMessage').textContent = system.message;
    
    // Show/hide appropriate cards based on status
    const startTrialCard = document.getElementById('startTrialCard');
    const trialInfoBox = document.getElementById('trialInfoBox');
    const activatedInfoBox = document.getElementById('activatedInfoBox');
    
    // Hide all first
    startTrialCard.classList.add('hidden');
    trialInfoBox.classList.add('hidden');
    activatedInfoBox.classList.add('hidden');
    
    // Update upgrade tab text
    const upgradeTabText = document.getElementById('upgradeTabText');
    
    if (system.status === 'ACTIVATED') {
      // System is activated - show activated info
      activatedInfoBox.classList.remove('hidden');
      document.getElementById('licenseDaysRemaining').textContent = license.daysRemaining + ' days';
      upgradeTabText.textContent = 'License';
      
      // Change status card color to green
      document.getElementById('systemStatusCard').className = 'bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-2xl p-8 text-white mb-6';
      
    } else if (system.status === 'TRIAL_EXPIRED') {
      // Trial expired - show activation form only
      upgradeTabText.textContent = '🔒 Upgrade';
      
      // Change status card color to red
      document.getElementById('systemStatusCard').className = 'bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-2xl p-8 text-white mb-6';
      
      // Show warning notification
      if (system.requiresAction) {
        showToast('Trial Expired', 'Your free trial has expired. Please activate with license key.', 'error');
      }
      
    } else if (system.status === 'TRIAL_ACTIVE') {
      // Trial is active - show trial info and activation option
      trialInfoBox.classList.remove('hidden');
      document.getElementById('daysRemainingDisplay').textContent = trial.daysRemaining;
      document.getElementById('daysUsedDisplay').textContent = trial.daysUsed;
      document.getElementById('expiryDateDisplay').textContent = new Date(trial.expiresAt).toLocaleDateString('bn-BD');
      
      upgradeTabText.textContent = 'Upgrade';
      
      // Change color based on warning
      if (trial.showWarning) {
        document.getElementById('systemStatusCard').className = 'bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-2xl p-8 text-white mb-6';
        showToast('Trial Expiring Soon', `Only ${trial.daysRemaining} days left in free trial!`, 'warning');
      } else {
        document.getElementById('systemStatusCard').className = 'bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-2xl p-8 text-white mb-6';
      }
      
    } else if (system.status === 'TRIAL_AVAILABLE') {
      // No trial started - show start trial button
      startTrialCard.classList.remove('hidden');
      upgradeTabText.textContent = '🎁 Free Trial';
      
      document.getElementById('systemStatusCard').className = 'bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-2xl p-8 text-white mb-6';
    }
    
    // Store status globally for other functions to use
    window.systemStatus = data;
    
  } catch (error) {
    console.error('Error loading system status:', error);
    showToast('Error', 'Failed to load system status', 'error');
  }
}

// Start Free Trial
async function startFreeTrial() {
  if (!confirm('Start 15-day free trial?\n\nYou will get full access to all features for 15 days.')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/trial/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Trial Started', '15-day free trial started successfully!', 'success');
      
      // Reload system status
      setTimeout(() => {
        loadSystemStatus();
      }, 1000);
      
    } else {
      showToast('Error', data.message || 'Failed to start trial', 'error');
    }
    
  } catch (error) {
    console.error('Error starting trial:', error);
    showToast('Error', 'Failed to start trial', 'error');
  }
}

// Activate License Form Submit
document.getElementById('activateLicenseForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const clientName = document.getElementById('licenseClientName').value.trim();
  const licenseKey = document.getElementById('licenseKeyInput').value.trim().toUpperCase();
  const expiryDate = document.getElementById('licenseExpiryDate').value;
  
  if (!clientName || !licenseKey || !expiryDate) {
    showToast('Validation Error', 'All fields are required', 'error');
    return;
  }
  
  // Validate license key format (SAJIB-XXXX-XXXX)
  if (!licenseKey.startsWith('SAJIB-') || licenseKey.length < 15) {
    showToast('Invalid License', 'License key format is incorrect', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/license/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        licenseKey: licenseKey,
        clientName: clientName,
        expiryDate: expiryDate
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Success', 'License activated successfully!', 'success');
      
      // Show instructions modal
      alert(
        '✅ License Activated Successfully!\n\n' +
        'Next Steps:\n' +
        '1. Update .env file with your license details\n' +
        '2. Restart the server (Ctrl+C then node server.js)\n' +
        '3. System will be fully unlocked\n\n' +
        'Need help? Contact: 01739354392'
      );
      
      // Clear form
      document.getElementById('activateLicenseForm').reset();
      
      // Reload status
      setTimeout(() => {
        loadSystemStatus();
      }, 1000);
      
    } else {
      showToast('Activation Failed', data.message || 'Invalid license key', 'error');
    }
    
  } catch (error) {
    console.error('Error activating license:', error);
    showToast('Error', 'Failed to activate license', 'error');
  }
});

// Update switchTab function to load system status when upgrade tab is opened
const originalSwitchTab = switchTab;
switchTab = function(tabName) {
  originalSwitchTab(tabName);
  
  // Load system status for upgrade tab
  if (tabName === 'upgrade') {
    loadSystemStatus();
  }
  
  // Load backups list for settings tab
  if (tabName === 'settings') {
    setTimeout(() => {
      loadBackupsList();
      loadCurrentLogo();
    }, 500);
  }
};

// Auto-check system status on page load
window.addEventListener('DOMContentLoaded', () => {
  loadSystemStatus();
  
  // Check status every 5 minutes
  setInterval(loadSystemStatus, 5 * 60 * 1000);
});


// ═══════════════════════════════════════════════════════════
// BACKUP & RESTORE FUNCTIONS
// ═══════════════════════════════════════════════════════════

// Create Backup
async function createBackup() {
  if (!confirm('Create complete backup?\n\nThis will backup your database to MySQL, JSON, and CSV formats.')) {
    return;
  }
  
  try {
    // Show loading status
    const statusDiv = document.getElementById('backupStatus');
    statusDiv.classList.remove('hidden');
    statusDiv.innerHTML = `
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center">
          <i class="fas fa-spinner fa-spin text-blue-600 text-2xl mr-3"></i>
          <div>
            <p class="font-semibold text-blue-800">Creating backup...</p>
            <p class="text-sm text-blue-600">This may take a few moments</p>
          </div>
        </div>
      </div>
    `;
    
    const response = await fetch(`${API_URL}/api/backup/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show success status
      statusDiv.innerHTML = `
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-start">
            <i class="fas fa-check-circle text-green-600 text-2xl mr-3 mt-1"></i>
            <div class="flex-1">
              <p class="font-semibold text-green-800 mb-2">Backup created successfully!</p>
              <div class="space-y-1 text-sm text-green-700">
                ${data.backup.backups.mysql.success ? `<p>✅ MySQL: ${data.backup.backups.mysql.filename} (${data.backup.backups.mysql.filesize})</p>` : ''}
                ${data.backup.backups.json.success ? `<p>✅ JSON: ${data.backup.backups.json.tables ? Object.keys(data.backup.backups.json.tables).length + ' tables' : 'Complete'}</p>` : ''}
                ${data.backup.backups.csv.success ? `<p>✅ CSV: ${data.backup.backups.csv.tables ? Object.keys(data.backup.backups.csv.tables).length + ' tables' : 'Complete'}</p>` : ''}
              </div>
              <p class="text-xs text-green-600 mt-3">
                <i class="fas fa-folder-open mr-1"></i> Backups saved in <code class="bg-white px-1 rounded">/backups</code> folder
              </p>
            </div>
          </div>
        </div>
      `;
      
      showToast('Backup Created', 'Database backup created successfully', 'success');
      
      // Reload backups list if visible
      if (!document.getElementById('backupsList').classList.contains('hidden')) {
        setTimeout(() => loadBackupsList(), 1000);
      }
      
    } else {
      // Show error status
      statusDiv.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start">
            <i class="fas fa-exclamation-circle text-red-600 text-2xl mr-3 mt-1"></i>
            <div>
              <p class="font-semibold text-red-800">Backup failed</p>
              <p class="text-sm text-red-600 mt-1">${data.message || 'Unknown error'}</p>
            </div>
          </div>
        </div>
      `;
      
      showToast('Backup Failed', data.message || 'Failed to create backup', 'error');
    }
    
  } catch (error) {
    console.error('Error creating backup:', error);
    
    const statusDiv = document.getElementById('backupStatus');
    statusDiv.classList.remove('hidden');
    statusDiv.innerHTML = `
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start">
          <i class="fas fa-exclamation-circle text-red-600 text-2xl mr-3 mt-1"></i>
          <div>
            <p class="font-semibold text-red-800">Backup failed</p>
            <p class="text-sm text-red-600 mt-1">${error.message}</p>
          </div>
        </div>
      </div>
    `;
    
    showToast('Error', 'Failed to create backup', 'error');
  }
}

// Load Backups List
async function loadBackupsList() {
  try {
    const response = await fetch(`${API_URL}/api/backup/list`);
    const data = await response.json();
    
    if (!data.success) {
      showToast('Error', 'Failed to load backups list', 'error');
      return;
    }
    
    const { backups, summary } = data;
    
    // Show backups list section
    document.getElementById('backupsList').classList.remove('hidden');
    
    // Update summary counts
    document.getElementById('mysqlBackupCount').textContent = summary.mysql;
    document.getElementById('jsonBackupCount').textContent = summary.json;
    document.getElementById('csvBackupCount').textContent = summary.csv;
    
    // Populate MySQL backups table
    const mysqlTable = document.getElementById('mysqlBackupsTable');
    if (backups.mysql.length === 0) {
      mysqlTable.innerHTML = '<tr><td colspan="4" class="px-4 py-4 text-center text-gray-500 text-xs">No MySQL backups found</td></tr>';
    } else {
      mysqlTable.innerHTML = backups.mysql.map(backup => `
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-3 text-xs">
            <i class="fas fa-file-code text-blue-600 mr-2"></i>
            <span class="font-mono">${backup.filename}</span>
          </td>
          <td class="px-4 py-3 text-xs text-gray-600">${backup.size}</td>
          <td class="px-4 py-3 text-xs text-gray-600">${new Date(backup.created).toLocaleString('bn-BD')}</td>
          <td class="px-4 py-3">
            <a href="${API_URL}/api/backup/download/mysql/${backup.filename}" class="text-blue-600 hover:text-blue-800 text-xs font-semibold" title="Download">
              <i class="fas fa-download mr-1"></i> Download
            </a>
          </td>
        </tr>
      `).join('');
    }
    
    // Populate JSON backups table
    const jsonTable = document.getElementById('jsonBackupsTable');
    if (backups.json.length === 0) {
      jsonTable.innerHTML = '<tr><td colspan="4" class="px-4 py-4 text-center text-gray-500 text-xs">No JSON backups found</td></tr>';
    } else {
      jsonTable.innerHTML = backups.json.map(backup => `
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-3 text-xs">
            <i class="fas fa-folder text-green-600 mr-2"></i>
            <span class="font-mono">${backup.folder}</span>
          </td>
          <td class="px-4 py-3 text-xs text-gray-600">${backup.files} files</td>
          <td class="px-4 py-3 text-xs text-gray-600">${new Date(backup.created).toLocaleString('bn-BD')}</td>
          <td class="px-4 py-3">
            <button onclick="openBackupFolder('json', '${backup.folder}')" class="text-green-600 hover:text-green-800 text-xs font-semibold" title="Open Folder">
              <i class="fas fa-folder-open mr-1"></i> Open
            </button>
          </td>
        </tr>
      `).join('');
    }
    
    // Populate CSV backups table
    const csvTable = document.getElementById('csvBackupsTable');
    if (backups.csv.length === 0) {
      csvTable.innerHTML = '<tr><td colspan="4" class="px-4 py-4 text-center text-gray-500 text-xs">No CSV backups found</td></tr>';
    } else {
      csvTable.innerHTML = backups.csv.map(backup => `
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-3 text-xs">
            <i class="fas fa-folder text-purple-600 mr-2"></i>
            <span class="font-mono">${backup.folder}</span>
          </td>
          <td class="px-4 py-3 text-xs text-gray-600">${backup.files} files</td>
          <td class="px-4 py-3 text-xs text-gray-600">${new Date(backup.created).toLocaleString('bn-BD')}</td>
          <td class="px-4 py-3">
            <button onclick="openBackupFolder('csv', '${backup.folder}')" class="text-purple-600 hover:text-purple-800 text-xs font-semibold" title="Open Folder">
              <i class="fas fa-folder-open mr-1"></i> Open
            </button>
          </td>
        </tr>
      `).join('');
    }
    
    showToast('Backups Loaded', `Found ${summary.total} backup(s)`, 'info');
    
  } catch (error) {
    console.error('Error loading backups:', error);
    showToast('Error', 'Failed to load backups list', 'error');
  }
}

// Open Backup Folder
function openBackupFolder(type, folder) {
  alert(
    `Backup Folder Location:\n\n` +
    `Type: ${type.toUpperCase()}\n` +
    `Folder: ${folder}\n\n` +
    `Location: /backups/${type}/${folder}\n\n` +
    `You can manually navigate to this folder in your file explorer and copy the files.`
  );
}

// Cleanup Old Backups
async function cleanupBackups() {
  const keepCount = prompt('How many recent backups to keep?\n\n(Older backups will be deleted)', '10');
  
  if (!keepCount || isNaN(keepCount)) {
    return;
  }
  
  if (!confirm(`Delete all backups except the most recent ${keepCount}?\n\nThis action cannot be undone!`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/backup/cleanup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keepCount: parseInt(keepCount) })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Cleanup Complete', `Deleted ${data.deletedCount} old backup(s)`, 'success');
      
      // Reload backups list
      if (!document.getElementById('backupsList').classList.contains('hidden')) {
        setTimeout(() => loadBackupsList(), 500);
      }
    } else {
      showToast('Cleanup Failed', data.message || 'Failed to cleanup backups', 'error');
    }
    
  } catch (error) {
    console.error('Error cleaning up backups:', error);
    showToast('Error', 'Failed to cleanup backups', 'error');
  }
}



// ═══════════════════════════════════════════════════════════
// CLIENT STATEMENT SYSTEM
// ═══════════════════════════════════════════════════════════

let currentStatementClient = null;
let currentStatementData = null;

// View Client Statement
function viewClientStatement(clientId, clientName, clientPhone) {
  currentStatementClient = {
    id: clientId,
    name: clientName,
    phone: clientPhone
  };
  
  // Show modal
  document.getElementById('clientStatementModal').classList.remove('hidden');
  
  // Set client info
  document.getElementById('statementClientName').textContent = clientName;
  document.getElementById('statementClientPhone').textContent = clientPhone;
  
  // Set default dates (last 1 month)
  setStatementPeriod('1month');
}

// Set Statement Period
function setStatementPeriod(period) {
  const toDate = new Date();
  let fromDate = new Date();
  
  switch(period) {
    case '1month':
      fromDate.setMonth(fromDate.getMonth() - 1);
      break;
    case '2months':
      fromDate.setMonth(fromDate.getMonth() - 2);
      break;
    case '3months':
      fromDate.setMonth(fromDate.getMonth() - 3);
      break;
    case '6months':
      fromDate.setMonth(fromDate.getMonth() - 6);
      break;
    case 'all':
      fromDate = null;
      break;
  }
  
  // Set date inputs
  document.getElementById('statementFromDate').value = fromDate ? fromDate.toISOString().split('T')[0] : '';
  document.getElementById('statementToDate').value = toDate.toISOString().split('T')[0];
  
  // Load statement
  loadClientStatement();
}

// Load Client Statement
async function loadClientStatement() {
  if (!currentStatementClient) return;
  
  const fromDate = document.getElementById('statementFromDate').value;
  const toDate = document.getElementById('statementToDate').value;
  
  try {
    const contentDiv = document.getElementById('statementContent');
    contentDiv.innerHTML = `
      <div class="text-center text-gray-500 py-8">
        <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
        <p>Loading statement...</p>
      </div>
    `;
    
    let url = `${API_URL}/api/clients/${currentStatementClient.id}/statement`;
    const params = new URLSearchParams();
    
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      contentDiv.innerHTML = `
        <div class="text-center text-red-500 py-8">
          <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
          <p>${data.message || 'Failed to load statement'}</p>
        </div>
      `;
      return;
    }
    
    currentStatementData = data;
    
    // Render statement
    renderStatement(data);
    
  } catch (error) {
    console.error('Error loading statement:', error);
    document.getElementById('statementContent').innerHTML = `
      <div class="text-center text-red-500 py-8">
        <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
        <p>Failed to load statement</p>
      </div>
    `;
  }
}

// Render Statement
function renderStatement(data) {
  const { client, period, transactions, summary } = data;
  
  let html = `
    <!-- Period Info -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
      <p class="text-blue-800">
        <i class="fas fa-calendar-alt mr-2"></i>
        <strong>Period:</strong> ${period.from} to ${period.to}
      </p>
    </div>
    
    <!-- Transactions Table -->
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
            <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600">Description</th>
            <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600">Bill</th>
            <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600">Paid</th>
            <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600">Due</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
  `;
  
  if (transactions.length === 0) {
    html += `
      <tr>
        <td colspan="5" class="px-3 py-6 text-center text-gray-500">
          <i class="fas fa-inbox text-2xl mb-2 block"></i>
          <p>No transactions in this period</p>
        </td>
      </tr>
    `;
  } else {
    transactions.forEach(t => {
      const date = new Date(t.created_at).toLocaleDateString('bn-BD');
      const itemsText = t.items && t.items.length > 0 
        ? t.items.map(item => item.item_name).join(', ') 
        : t.description || '-';
      
      html += `
        <tr class="hover:bg-gray-50">
          <td class="px-3 py-2 text-gray-600">${date}</td>
          <td class="px-3 py-2 text-gray-800">
            ${itemsText}
            ${t.items_count > 0 ? `<span class="text-xs text-gray-500">(${t.items_count} items)</span>` : ''}
          </td>
          <td class="px-3 py-2 text-right font-semibold text-gray-800">৳${parseFloat(t.subtotal || 0).toFixed(2)}</td>
          <td class="px-3 py-2 text-right font-semibold text-green-600">৳${parseFloat(t.paid_amount || 0).toFixed(2)}</td>
          <td class="px-3 py-2 text-right font-semibold text-red-600">৳${parseFloat(t.current_due || 0).toFixed(2)}</td>
        </tr>
      `;
    });
  }
  
  html += `
        </tbody>
      </table>
    </div>
    
    <!-- Summary -->
    <div class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
      <h4 class="font-bold text-gray-800 mb-3">Summary</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div class="bg-white rounded-lg p-3">
          <p class="text-xs text-gray-600 mb-1">Total Bills</p>
          <p class="text-xl font-bold text-gray-800">${summary.total_bills}</p>
        </div>
        <div class="bg-white rounded-lg p-3">
          <p class="text-xs text-gray-600 mb-1">Total Income</p>
          <p class="text-xl font-bold text-blue-600">৳${summary.total_income.toFixed(2)}</p>
        </div>
        <div class="bg-white rounded-lg p-3">
          <p class="text-xs text-gray-600 mb-1">Total Paid</p>
          <p class="text-xl font-bold text-green-600">৳${summary.total_paid.toFixed(2)}</p>
        </div>
        <div class="bg-white rounded-lg p-3">
          <p class="text-xs text-gray-600 mb-1">Current Balance</p>
          <p class="text-xl font-bold text-red-600">৳${summary.current_balance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('statementContent').innerHTML = html;
}

// Print Statement
function printStatement() {
  if (!currentStatementData) {
    showToast('Error', 'No statement data to print', 'error');
    return;
  }
  
  const { client, period, transactions, summary } = currentStatementData;
  
  // Create print window
  const printWindow = window.open('', '_blank');
  
  let printHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Statement - ${client.name}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .client-info { margin-bottom: 20px; }
        .period { background: #f0f0f0; padding: 10px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .text-right { text-align: right; }
        .summary { background: #f9f9f9; padding: 15px; border: 2px solid #333; }
        .summary-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Client Statement</h1>
        <p>Sajib Digital Hub</p>
      </div>
      
      <div class="client-info">
        <p><strong>Client Name:</strong> ${client.name}</p>
        <p><strong>Phone:</strong> ${client.phone}</p>
      </div>
      
      <div class="period">
        <strong>Period:</strong> ${period.from} to ${period.to}
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th class="text-right">Bill Amount</th>
            <th class="text-right">Paid</th>
            <th class="text-right">Due</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  transactions.forEach(t => {
    const date = new Date(t.created_at).toLocaleDateString('bn-BD');
    const itemsText = t.items && t.items.length > 0 
      ? t.items.map(item => item.item_name).join(', ') 
      : t.description || '-';
    
    printHTML += `
      <tr>
        <td>${date}</td>
        <td>${itemsText}</td>
        <td class="text-right">৳${parseFloat(t.subtotal || 0).toFixed(2)}</td>
        <td class="text-right">৳${parseFloat(t.paid_amount || 0).toFixed(2)}</td>
        <td class="text-right">৳${parseFloat(t.current_due || 0).toFixed(2)}</td>
      </tr>
    `;
  });
  
  printHTML += `
        </tbody>
      </table>
      
      <div class="summary">
        <h3>Summary</h3>
        <div class="summary-item">
          <span>Total Bills:</span>
          <span><strong>${summary.total_bills}</strong></span>
        </div>
        <div class="summary-item">
          <span>Total Income:</span>
          <span><strong>৳${summary.total_income.toFixed(2)}</strong></span>
        </div>
        <div class="summary-item">
          <span>Total Paid:</span>
          <span><strong>৳${summary.total_paid.toFixed(2)}</strong></span>
        </div>
        <div class="summary-item total">
          <span>Current Balance (Due):</span>
          <span><strong>৳${summary.current_balance.toFixed(2)}</strong></span>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(printHTML);
  printWindow.document.close();
}

// Send Statement via WhatsApp
async function sendStatementWhatsApp() {
  if (!currentStatementData) {
    showToast('Error', 'No statement data to send', 'error');
    return;
  }
  
  const { client, period, transactions, summary } = currentStatementData;
  
  // Format WhatsApp message
  let message = `╔════════════════════════════╗\n`;
  message += `║  📊 CLIENT STATEMENT       ║\n`;
  message += `╚════════════════════════════╝\n\n`;
  
  message += `👤 *Client:* ${client.name}\n`;
  message += `📱 Phone: ${client.phone}\n`;
  message += `📅 Period: ${period.from} to ${period.to}\n\n`;
  
  message += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
  message += `┃ *TRANSACTIONS*             ┃\n`;
  message += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n\n`;
  
  transactions.forEach((t, index) => {
    const date = new Date(t.created_at).toLocaleDateString('bn-BD', { day: '2-digit', month: 'short' });
    const itemsText = t.items && t.items.length > 0 
      ? t.items.map(item => item.item_name).slice(0, 2).join(', ')
      : (t.description || 'Bill').substring(0, 20);
    
    message += `${index + 1}. ${date} - ${itemsText}\n`;
    message += `   Bill: ৳${parseFloat(t.subtotal || 0).toFixed(2)} | `;
    message += `Paid: ৳${parseFloat(t.paid_amount || 0).toFixed(2)} | `;
    message += `Due: ৳${parseFloat(t.current_due || 0).toFixed(2)}\n\n`;
  });
  
  message += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
  
  message += `╔════════════════════════════╗\n`;
  message += `║  📊 SUMMARY                ║\n`;
  message += `╠════════════════════════════╣\n`;
  message += `║ Total Bills: ${summary.total_bills.toString().padStart(12, ' ')}  ║\n`;
  message += `║ Total Income: ৳${summary.total_income.toFixed(2).padStart(10, ' ')} ║\n`;
  message += `║ Total Paid: ৳${summary.total_paid.toFixed(2).padStart(12, ' ')} ║\n`;
  message += `╠════════════════════════════╣\n`;
  message += `║ *Current Balance (Due):*   ║\n`;
  message += `║      *৳${summary.current_balance.toFixed(2)}*${' '.repeat(Math.max(0, 18 - summary.current_balance.toFixed(2).length))} ║\n`;
  message += `╚════════════════════════════╝\n\n`;
  
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `✨ Sajib Digital Hub ✨\n`;
  message += `📱 01739354392\n`;
  
  // Encode and open WhatsApp
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = client.phone.replace(/[^0-9]/g, '');
  const whatsappNumber = phoneNumber.startsWith('880') ? phoneNumber : '880' + phoneNumber.replace(/^0/, '');
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  
  window.open(whatsappURL, '_blank');
  showToast('WhatsApp Opened', 'Statement message prepared', 'success');
}

// Close Statement Modal
function closeStatementModal() {
  document.getElementById('clientStatementModal').classList.add('hidden');
  currentStatementClient = null;
  currentStatementData = null;
}


// ═══════════════════════════════════════════════════════════
// LOGO UPLOAD SYSTEM
// ═══════════════════════════════════════════════════════════

// Load and display current logo
async function loadCurrentLogo() {
  try {
    const response = await fetch(`${API_URL}/api/settings`);
    const data = await response.json();
    
    if (data.success && data.data.logo_path) {
      const logoPreview = document.getElementById('currentLogoPreview');
      logoPreview.innerHTML = `
        <img src="${data.data.logo_path}" alt="Business Logo" class="max-h-32 max-w-full object-contain">
      `;
      
      // Show remove button
      document.getElementById('removeLogoBtn').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error loading logo:', error);
  }
}

// Logo Upload Form Submit
document.getElementById('logoUploadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fileInput = document.getElementById('logoFile');
  const file = fileInput.files[0];
  
  if (!file) {
    showToast('No File', 'Please select an image file', 'warning');
    return;
  }
  
  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    showToast('File Too Large', 'Image must be less than 2MB', 'error');
    return;
  }
  
  // Validate file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    showToast('Invalid File', 'Only PNG, JPG, GIF images are allowed', 'error');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await fetch(`${API_URL}/api/settings/logo`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Logo Uploaded', 'Business logo updated successfully', 'success');
      
      // Update preview
      const logoPreview = document.getElementById('currentLogoPreview');
      logoPreview.innerHTML = `
        <img src="${data.logo_path}" alt="Business Logo" class="max-h-32 max-w-full object-contain">
      `;
      
      // Show remove button
      document.getElementById('removeLogoBtn').classList.remove('hidden');
      
      // Reset form
      fileInput.value = '';
      
    } else {
      showToast('Upload Failed', data.message || 'Failed to upload logo', 'error');
    }
    
  } catch (error) {
    console.error('Error uploading logo:', error);
    showToast('Error', 'Network error occurred', 'error');
  }
});

// Remove Logo
async function removeLogo() {
  if (!confirm('Are you sure you want to remove the logo?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/settings/logo`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Logo Removed', 'Business logo removed successfully', 'success');
      
      // Update preview
      const logoPreview = document.getElementById('currentLogoPreview');
      logoPreview.innerHTML = `
        <div class="text-gray-400">
          <i class="fas fa-image text-4xl mb-2"></i>
          <p class="text-sm">No logo uploaded</p>
        </div>
      `;
      
      // Hide remove button
      document.getElementById('removeLogoBtn').classList.add('hidden');
      
    } else {
      showToast('Remove Failed', data.message || 'Failed to remove logo', 'error');
    }
    
  } catch (error) {
    console.error('Error removing logo:', error);
    showToast('Error', 'Network error occurred', 'error');
  }
}

