// License Control System for POS Billing
// Developer: Sajib Digital Hub
// Contact: 01739354392 | @sajibrasel2

const crypto = require('crypto');

// আপনার secret key (কাউকে দেবেন না!)
const SECRET_KEY = 'SAJIB_DIGITAL_HUB_2024_SECRET_KEY';

// License Generator (শুধু আপনার computer এ চালাবেন)
function generateLicenseKey(clientName, expiryDate) {
  const data = `${clientName}|${expiryDate}|${SECRET_KEY}`;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  const licenseKey = `SAJIB-${hash.substring(0, 8).toUpperCase()}-${hash.substring(8, 16).toUpperCase()}`;
  
  return {
    licenseKey,
    clientName,
    expiryDate,
    generatedAt: new Date().toISOString()
  };
}

// License Validator (software এ built-in)
function validateLicense(licenseKey, clientName, expiryDate) {
  try {
    // Generate expected key
    const expected = generateLicenseKey(clientName, expiryDate);
    
    // Check if matches
    if (expected.licenseKey !== licenseKey) {
      return {
        valid: false,
        message: 'Invalid license key',
        status: 'INVALID'
      };
    }
    
    // Check expiry
    const expiry = new Date(expiryDate);
    const today = new Date();
    
    if (today > expiry) {
      const daysExpired = Math.floor((today - expiry) / (1000 * 60 * 60 * 24));
      return {
        valid: false,
        message: `License expired ${daysExpired} days ago`,
        status: 'EXPIRED',
        daysExpired
      };
    }
    
    // Calculate days remaining
    const daysRemaining = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    
    return {
      valid: true,
      message: 'License is valid',
      status: 'ACTIVE',
      daysRemaining,
      expiryDate
    };
    
  } catch (error) {
    return {
      valid: false,
      message: 'License verification failed',
      status: 'ERROR'
    };
  }
}

// Check if need to show warning
function shouldShowWarning(daysRemaining) {
  return daysRemaining <= 15; // 15 days আগে warning
}

// Generate multiple licenses for testing
function generateBulkLicenses() {
  const clients = [
    { name: 'রাসেল সাহেব', months: 1 },
    { name: 'করিম সাহেব', months: 3 },
    { name: 'Test Client', months: 12 }
  ];
  
  const licenses = [];
  
  clients.forEach(client => {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + client.months);
    const expiryStr = expiry.toISOString().split('T')[0];
    
    const license = generateLicenseKey(client.name, expiryStr);
    licenses.push(license);
  });
  
  return licenses;
}

// Example usage
if (require.main === module) {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('🔐 License Key Generator - Sajib Digital Hub');
  console.log('═══════════════════════════════════════════════════\n');
  
  // Generate a license
  const clientName = 'Test Client';
  const expiryDate = '2025-12-31'; // YYYY-MM-DD
  
  const license = generateLicenseKey(clientName, expiryDate);
  
  console.log('Generated License:');
  console.log('─────────────────────────────────────────────────');
  console.log(`Client Name:  ${license.clientName}`);
  console.log(`License Key:  ${license.licenseKey}`);
  console.log(`Expiry Date:  ${license.expiryDate}`);
  console.log(`Generated At: ${new Date(license.generatedAt).toLocaleString('bn-BD')}`);
  console.log('─────────────────────────────────────────────────\n');
  
  // Validate the license
  const validation = validateLicense(license.licenseKey, clientName, expiryDate);
  
  console.log('Validation Result:');
  console.log('─────────────────────────────────────────────────');
  console.log(`Status:   ${validation.status}`);
  console.log(`Valid:    ${validation.valid ? '✅ Yes' : '❌ No'}`);
  console.log(`Message:  ${validation.message}`);
  if (validation.daysRemaining) {
    console.log(`Days Remaining: ${validation.daysRemaining} days`);
    if (shouldShowWarning(validation.daysRemaining)) {
      console.log(`⚠️  WARNING: License expiring soon!`);
    }
  }
  console.log('─────────────────────────────────────────────────\n');
  
  // Generate bulk licenses
  console.log('Bulk License Generation:');
  console.log('═══════════════════════════════════════════════════');
  const bulk = generateBulkLicenses();
  bulk.forEach((lic, index) => {
    console.log(`\n${index + 1}. Client: ${lic.clientName}`);
    console.log(`   License: ${lic.licenseKey}`);
    console.log(`   Expiry:  ${lic.expiryDate}`);
  });
  console.log('\n═══════════════════════════════════════════════════\n');
}

module.exports = {
  generateLicenseKey,
  validateLicense,
  shouldShowWarning
};
