#!/usr/bin/env node

// 🔐 License Generator for Sajib Digital Hub
// এই file শুধু আপনি ব্যবহার করবেন
// Client কে দেবেন না!

const { generateLicenseKey } = require('./license_system');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║   🔐 License Key Generator                        ║');
console.log('║   Sajib Digital Hub - Developer Tools            ║');
console.log('╚════════════════════════════════════════════════════╝\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function generateNewLicense() {
  try {
    console.log('📝 Client Information:\n');
    
    // Get client name
    const clientName = await askQuestion('Client Name (ক্লায়েন্টের নাম): ');
    
    if (!clientName || clientName.trim() === '') {
      console.log('❌ Client name required!');
      rl.close();
      return;
    }
    
    // Get duration
    console.log('\n⏰ License Duration:');
    console.log('   1. 1 Month  (৳500)');
    console.log('   2. 3 Months (৳1,200)');
    console.log('   3. 6 Months (৳2,000)');
    console.log('   4. 1 Year   (৳3,000)');
    console.log('   5. Custom');
    
    const duration = await askQuestion('\nSelect option (1-5): ');
    
    let months;
    let price;
    
    switch(duration) {
      case '1':
        months = 1;
        price = '৳500';
        break;
      case '2':
        months = 3;
        price = '৳1,200';
        break;
      case '3':
        months = 6;
        price = '৳2,000';
        break;
      case '4':
        months = 12;
        price = '৳3,000';
        break;
      case '5':
        const customMonths = await askQuestion('Enter months: ');
        months = parseInt(customMonths);
        price = 'Custom';
        break;
      default:
        console.log('❌ Invalid option!');
        rl.close();
        return;
    }
    
    // Calculate expiry date
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + months);
    const expiryStr = expiry.toISOString().split('T')[0];
    
    // Generate license
    const license = generateLicenseKey(clientName, expiryStr);
    
    // Display result
    console.log('\n\n╔════════════════════════════════════════════════════╗');
    console.log('║   ✅ LICENSE GENERATED SUCCESSFULLY               ║');
    console.log('╚════════════════════════════════════════════════════╝\n');
    
    console.log('📋 License Details:');
    console.log('─────────────────────────────────────────────────────');
    console.log(`   Client Name:    ${license.clientName}`);
    console.log(`   License Key:    ${license.licenseKey}`);
    console.log(`   Issue Date:     ${new Date().toLocaleDateString('en-GB')}`);
    console.log(`   Expiry Date:    ${new Date(expiryStr).toLocaleDateString('en-GB')}`);
    console.log(`   Duration:       ${months} month(s)`);
    console.log(`   Price:          ${price}`);
    console.log('─────────────────────────────────────────────────────\n');
    
    console.log('📝 Client কে পাঠান (.env file এ যোগ করতে বলুন):\n');
    console.log('─────────────────────────────────────────────────────');
    console.log(`LICENSE_CLIENT_NAME=${license.clientName}`);
    console.log(`LICENSE_KEY=${license.licenseKey}`);
    console.log(`LICENSE_EXPIRY=${expiryStr}`);
    console.log('─────────────────────────────────────────────────────\n');
    
    console.log('💾 Record এ সেভ করুন:\n');
    console.log('─────────────────────────────────────────────────────');
    console.log(`Date: ${new Date().toLocaleString('en-GB')}`);
    console.log(`Client: ${license.clientName}`);
    console.log(`Key: ${license.licenseKey}`);
    console.log(`Expiry: ${new Date(expiryStr).toLocaleDateString('en-GB')}`);
    console.log(`Payment: ${price}`);
    console.log('─────────────────────────────────────────────────────\n');
    
    console.log('📞 Renewal reminder পাঠান:\n');
    const reminderDate = new Date(expiryStr);
    reminderDate.setDate(reminderDate.getDate() - 7);
    console.log(`   Send reminder on: ${reminderDate.toLocaleDateString('en-GB')}`);
    console.log(`   WhatsApp/Facebook: "আপনার license ${new Date(expiryStr).toLocaleDateString('en-GB')} তারিখে expire হবে। Renew করতে যোগাযোগ করুন।"\n`);
    
    // Ask if want to generate another
    const another = await askQuestion('Generate another license? (y/n): ');
    if (another.toLowerCase() === 'y') {
      await generateNewLicense();
    } else {
      console.log('\n✅ Done! Keep this record safe.\n');
      rl.close();
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
  }
}

// Run
generateNewLicense();
