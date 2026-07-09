// Free Trial System with Machine ID Tracking
// 15-day trial, prevents repeated trials on same device
// Developer: Sajib Digital Hub

const { getMachineId } = require('./machine_id');
const { getPool } = require('./db');

/**
 * Initialize trial system - create table if not exists
 */
async function initializeTrialSystem() {
  try {
    const pool = getPool();
    
    // Create trial_tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trial_tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        machine_id VARCHAR(50) UNIQUE NOT NULL,
        machine_hash VARCHAR(255) NOT NULL,
        trial_started_at DATETIME NOT NULL,
        trial_expires_at DATETIME NOT NULL,
        is_activated BOOLEAN DEFAULT FALSE,
        activation_date DATETIME NULL,
        license_key VARCHAR(100) NULL,
        hostname VARCHAR(255),
        platform VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_machine_id (machine_id),
        INDEX idx_machine_hash (machine_hash)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Trial tracking table ready');
    return true;
  } catch (error) {
    console.error('❌ Error initializing trial system:', error);
    return false;
  }
}

/**
 * Start free trial for current machine
 * Returns trial info or error if trial already used
 */
async function startFreeTrial() {
  try {
    const pool = getPool();
    const machineData = getMachineId();
    
    // Check if machine already has trial record
    const [existing] = await pool.query(
      'SELECT * FROM trial_tracking WHERE machine_id = ? OR machine_hash = ?',
      [machineData.machineId, machineData.fullHash]
    );
    
    if (existing.length > 0) {
      // Machine already has trial record
      const trial = existing[0];
      
      return {
        success: false,
        status: 'TRIAL_EXISTS',
        message: 'Free trial already used on this device',
        trial: {
          machineId: trial.machine_id,
          startedAt: trial.trial_started_at,
          expiresAt: trial.trial_expires_at,
          isActivated: trial.is_activated,
          licenseKey: trial.license_key
        }
      };
    }
    
    // Start new trial
    const now = new Date();
    const expiryDate = new Date(now.getTime() + (15 * 24 * 60 * 60 * 1000)); // 15 days from now
    
    await pool.query(`
      INSERT INTO trial_tracking 
      (machine_id, machine_hash, trial_started_at, trial_expires_at, hostname, platform) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      machineData.machineId,
      machineData.fullHash,
      now,
      expiryDate,
      machineData.components.hostname || 'unknown',
      machineData.components.platform || 'unknown'
    ]);
    
    return {
      success: true,
      status: 'TRIAL_STARTED',
      message: '15-day free trial started successfully',
      trial: {
        machineId: machineData.machineId,
        startedAt: now,
        expiresAt: expiryDate,
        daysRemaining: 15
      }
    };
    
  } catch (error) {
    console.error('Error starting free trial:', error);
    return {
      success: false,
      status: 'ERROR',
      message: error.message
    };
  }
}

/**
 * Get current trial status for this machine
 */
async function getTrialStatus() {
  try {
    const pool = getPool();
    const machineData = getMachineId();
    
    // Check if machine has trial record
    const [existing] = await pool.query(
      'SELECT * FROM trial_tracking WHERE machine_id = ? OR machine_hash = ?',
      [machineData.machineId, machineData.fullHash]
    );
    
    if (existing.length === 0) {
      // No trial record - can start trial
      return {
        status: 'NO_TRIAL',
        message: 'Free trial available',
        canStartTrial: true,
        trialAvailable: true
      };
    }
    
    const trial = existing[0];
    const now = new Date();
    const expiresAt = new Date(trial.trial_expires_at);
    const daysRemaining = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
    
    // Check if activated with license
    if (trial.is_activated && trial.license_key) {
      return {
        status: 'ACTIVATED',
        message: 'System activated with license key',
        isActivated: true,
        licenseKey: trial.license_key,
        activationDate: trial.activation_date,
        machineId: trial.machine_id
      };
    }
    
    // Check if trial expired
    if (now > expiresAt) {
      return {
        status: 'TRIAL_EXPIRED',
        message: 'Free trial has expired',
        trialExpired: true,
        expiredAt: expiresAt,
        daysExpired: Math.abs(daysRemaining),
        machineId: trial.machine_id,
        canStartTrial: false,
        requiresLicense: true
      };
    }
    
    // Trial is active
    return {
      status: 'TRIAL_ACTIVE',
      message: `Free trial active: ${daysRemaining} days remaining`,
      isTrialActive: true,
      trialStarted: trial.trial_started_at,
      trialExpires: trial.trial_expires_at,
      daysRemaining: daysRemaining,
      daysUsed: 15 - daysRemaining,
      machineId: trial.machine_id,
      showWarning: daysRemaining <= 3 // Show warning in last 3 days
    };
    
  } catch (error) {
    console.error('Error getting trial status:', error);
    return {
      status: 'ERROR',
      message: error.message,
      error: true
    };
  }
}

/**
 * Activate system with license key
 * This converts trial to full license
 */
async function activateWithLicense(licenseKey, clientName, expiryDate) {
  try {
    const pool = getPool();
    const machineData = getMachineId();
    
    // Get trial record
    const [existing] = await pool.query(
      'SELECT * FROM trial_tracking WHERE machine_id = ? OR machine_hash = ?',
      [machineData.machineId, machineData.fullHash]
    );
    
    if (existing.length === 0) {
      // No trial record - create one with activation
      const now = new Date();
      await pool.query(`
        INSERT INTO trial_tracking 
        (machine_id, machine_hash, trial_started_at, trial_expires_at, is_activated, activation_date, license_key, hostname, platform) 
        VALUES (?, ?, ?, ?, TRUE, ?, ?, ?, ?)
      `, [
        machineData.machineId,
        machineData.fullHash,
        now,
        now, // Trial dates don't matter when activated
        now,
        licenseKey,
        machineData.components.hostname || 'unknown',
        machineData.components.platform || 'unknown'
      ]);
    } else {
      // Update existing record
      await pool.query(`
        UPDATE trial_tracking 
        SET is_activated = TRUE, activation_date = ?, license_key = ? 
        WHERE machine_id = ? OR machine_hash = ?
      `, [new Date(), licenseKey, machineData.machineId, machineData.fullHash]);
    }
    
    return {
      success: true,
      message: 'System activated successfully',
      licenseKey: licenseKey,
      activatedAt: new Date(),
      machineId: machineData.machineId
    };
    
  } catch (error) {
    console.error('Error activating license:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Check if system should be locked (trial expired and not activated)
 */
function shouldLockSystem(trialStatus) {
  return trialStatus.status === 'TRIAL_EXPIRED' && !trialStatus.isActivated;
}

/**
 * Get all trial records (for admin panel)
 */
async function getAllTrials() {
  try {
    const pool = getPool();
    const [trials] = await pool.query(`
      SELECT 
        machine_id,
        hostname,
        platform,
        trial_started_at,
        trial_expires_at,
        is_activated,
        activation_date,
        license_key,
        created_at
      FROM trial_tracking 
      ORDER BY created_at DESC
    `);
    
    // Calculate status for each trial
    const now = new Date();
    return trials.map(trial => {
      const expiresAt = new Date(trial.trial_expires_at);
      const daysRemaining = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
      
      let status;
      if (trial.is_activated) {
        status = 'Activated';
      } else if (now > expiresAt) {
        status = 'Expired';
      } else {
        status = `Active (${daysRemaining}d left)`;
      }
      
      return {
        ...trial,
        status,
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0
      };
    });
    
  } catch (error) {
    console.error('Error getting all trials:', error);
    return [];
  }
}

// Example usage and testing
if (require.main === module) {
  (async () => {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🎁 Free Trial System - Sajib Digital Hub');
    console.log('═══════════════════════════════════════════════════\n');
    
    // Initialize system
    const { autoConfigureDatabase } = require('./db');
    await autoConfigureDatabase();
    await initializeTrialSystem();
    
    // Get current status
    const status = await getTrialStatus();
    
    console.log('Current Trial Status:');
    console.log('─────────────────────────────────────────────────');
    console.log(`Status:   ${status.status}`);
    console.log(`Message:  ${status.message}`);
    
    if (status.isTrialActive) {
      console.log(`Days Remaining: ${status.daysRemaining} days`);
      console.log(`Days Used: ${status.daysUsed} days`);
      console.log(`Expires At: ${new Date(status.trialExpires).toLocaleString('bn-BD')}`);
      
      if (status.showWarning) {
        console.log(`⚠️  WARNING: Trial expiring soon!`);
      }
    }
    
    if (status.trialExpired) {
      console.log(`Expired At: ${new Date(status.expiredAt).toLocaleString('bn-BD')}`);
      console.log(`Days Expired: ${status.daysExpired} days ago`);
      console.log(`🔒 System is LOCKED - License required`);
    }
    
    if (status.isActivated) {
      console.log(`License Key: ${status.licenseKey}`);
      console.log(`Activated At: ${new Date(status.activationDate).toLocaleString('bn-BD')}`);
      console.log(`✅ System is ACTIVATED`);
    }
    
    if (status.canStartTrial) {
      console.log(`\n✨ You can start 15-day free trial!`);
      console.log(`Run: node trial_system.js start-trial`);
    }
    
    console.log('─────────────────────────────────────────────────');
    console.log(`Machine ID: ${status.machineId || 'Unknown'}`);
    
    console.log('\n═══════════════════════════════════════════════════\n');
    
    // Handle command line arguments
    const command = process.argv[2];
    
    if (command === 'start-trial') {
      console.log('Starting free trial...\n');
      const result = await startFreeTrial();
      console.log('Result:');
      console.log('─────────────────────────────────────────────────');
      console.log(JSON.stringify(result, null, 2));
      console.log('\n');
    }
    
    if (command === 'list-trials') {
      console.log('All Trial Records:\n');
      const trials = await getAllTrials();
      console.log('─────────────────────────────────────────────────');
      trials.forEach((trial, index) => {
        console.log(`\n${index + 1}. Machine: ${trial.machine_id}`);
        console.log(`   Hostname: ${trial.hostname}`);
        console.log(`   Status: ${trial.status}`);
        console.log(`   Started: ${new Date(trial.trial_started_at).toLocaleString('bn-BD')}`);
        if (trial.is_activated) {
          console.log(`   License: ${trial.license_key}`);
        }
      });
      console.log('\n');
    }
    
    process.exit(0);
  })();
}

module.exports = {
  initializeTrialSystem,
  startFreeTrial,
  getTrialStatus,
  activateWithLicense,
  shouldLockSystem,
  getAllTrials
};
