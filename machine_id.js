// Machine ID Fingerprinting System
// Prevents repeated free trials on same device
// Developer: Sajib Digital Hub

const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// File to store machine ID permanently
const MACHINE_ID_FILE = path.join(__dirname, '.machine_id');

/**
 * Generate unique machine ID based on hardware identifiers
 * Uses: MAC address, CPU info, Hostname, Platform
 */
function generateMachineId() {
  try {
    // Get network interfaces (MAC addresses)
    const networkInterfaces = os.networkInterfaces();
    const macAddresses = [];
    
    for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];
      interfaces.forEach(iface => {
        if (iface.mac && iface.mac !== '00:00:00:00:00:00') {
          macAddresses.push(iface.mac);
        }
      });
    }
    
    // Sort MAC addresses for consistency
    macAddresses.sort();
    const macString = macAddresses.join('|');
    
    // Get CPU info
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : 'unknown';
    
    // Get hostname
    const hostname = os.hostname();
    
    // Get platform and architecture
    const platform = os.platform();
    const arch = os.arch();
    
    // Combine all identifiers
    const combinedData = `${macString}|${cpuModel}|${hostname}|${platform}|${arch}`;
    
    // Generate SHA256 hash
    const hash = crypto.createHash('sha256').update(combinedData).digest('hex');
    
    // Format as readable machine ID: MACH-XXXX-XXXX-XXXX-XXXX
    const formattedId = `MACH-${hash.substring(0, 4)}-${hash.substring(4, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}`.toUpperCase();
    
    return {
      machineId: formattedId,
      fullHash: hash,
      components: {
        mac: macString,
        cpu: cpuModel,
        hostname: hostname,
        platform: platform,
        arch: arch
      },
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error generating machine ID:', error);
    // Fallback to random ID if hardware detection fails
    const randomId = crypto.randomBytes(16).toString('hex');
    return {
      machineId: `MACH-${randomId.substring(0, 4)}-${randomId.substring(4, 8)}-${randomId.substring(8, 12)}-${randomId.substring(12, 16)}`.toUpperCase(),
      fullHash: randomId,
      components: {},
      generatedAt: new Date().toISOString(),
      error: error.message
    };
  }
}

/**
 * Get or create machine ID
 * If file exists, read from file. Otherwise generate new and save.
 */
function getMachineId() {
  try {
    // Check if machine ID file already exists
    if (fs.existsSync(MACHINE_ID_FILE)) {
      const data = fs.readFileSync(MACHINE_ID_FILE, 'utf8');
      const machineData = JSON.parse(data);
      
      console.log('✅ Machine ID loaded from file');
      return machineData;
    } else {
      // Generate new machine ID
      const machineData = generateMachineId();
      
      // Save to file
      fs.writeFileSync(MACHINE_ID_FILE, JSON.stringify(machineData, null, 2));
      
      console.log('✅ New Machine ID generated and saved');
      return machineData;
    }
  } catch (error) {
    console.error('Error getting machine ID:', error);
    // Return temporary machine ID if file operations fail
    return generateMachineId();
  }
}

/**
 * Verify if machine ID matches stored ID
 * This prevents tampering by checking hardware fingerprint
 */
function verifyMachineId(storedMachineId) {
  try {
    const currentMachine = generateMachineId();
    
    // Compare full hash (more secure than just ID)
    if (currentMachine.fullHash === storedMachineId.fullHash) {
      return {
        valid: true,
        message: 'Machine ID matches'
      };
    } else {
      return {
        valid: false,
        message: 'Machine ID mismatch - hardware changed',
        currentId: currentMachine.machineId,
        storedId: storedMachineId.machineId
      };
    }
  } catch (error) {
    return {
      valid: false,
      message: 'Verification error: ' + error.message
    };
  }
}

/**
 * Get system information for debugging
 */
function getSystemInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    cpus: os.cpus().length,
    totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
    freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
    uptime: `${(os.uptime() / 60 / 60).toFixed(2)} hours`,
    nodeVersion: process.version,
    systemType: os.type(),
    release: os.release()
  };
}

// Example usage and testing
if (require.main === module) {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('🔐 Machine ID Generator - Sajib Digital Hub');
  console.log('═══════════════════════════════════════════════════\n');
  
  // Get or generate machine ID
  const machineData = getMachineId();
  
  console.log('Machine Identification:');
  console.log('─────────────────────────────────────────────────');
  console.log(`Machine ID:   ${machineData.machineId}`);
  console.log(`Generated At: ${new Date(machineData.generatedAt).toLocaleString('bn-BD')}`);
  
  if (machineData.components) {
    console.log('\nHardware Components:');
    console.log('─────────────────────────────────────────────────');
    console.log(`Hostname:     ${machineData.components.hostname || 'N/A'}`);
    console.log(`Platform:     ${machineData.components.platform || 'N/A'}`);
    console.log(`Architecture: ${machineData.components.arch || 'N/A'}`);
    console.log(`CPU Model:    ${machineData.components.cpu || 'N/A'}`);
    console.log(`MAC Address:  ${machineData.components.mac ? machineData.components.mac.substring(0, 50) + '...' : 'N/A'}`);
  }
  
  console.log('\nSystem Information:');
  console.log('─────────────────────────────────────────────────');
  const sysInfo = getSystemInfo();
  Object.entries(sysInfo).forEach(([key, value]) => {
    console.log(`${key.padEnd(15)}: ${value}`);
  });
  
  console.log('\n═══════════════════════════════════════════════════');
  console.log('✅ Machine ID is stored in .machine_id file');
  console.log('⚠️  Do not delete this file to maintain trial status');
  console.log('═══════════════════════════════════════════════════\n');
  
  // Test verification
  const verification = verifyMachineId(machineData);
  console.log('Verification Test:');
  console.log('─────────────────────────────────────────────────');
  console.log(`Status:  ${verification.valid ? '✅ VALID' : '❌ INVALID'}`);
  console.log(`Message: ${verification.message}`);
  console.log('─────────────────────────────────────────────────\n');
}

module.exports = {
  getMachineId,
  generateMachineId,
  verifyMachineId,
  getSystemInfo
};
