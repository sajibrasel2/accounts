// =========================================================
// Electron Preload Script
// Secure bridge between renderer and main process
// =========================================================

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Get server status
  getServerStatus: () => ipcRenderer.invoke('get-server-status'),
  
  // Restart server
  restartServer: () => ipcRenderer.invoke('restart-server'),
  
  // Check if running in Electron
  isElectron: () => true,
  
  // Get app version
  getVersion: () => process.env.npm_package_version || '3.0.0',
  
  // Platform info
  platform: process.platform
});

console.log('✅ Preload script loaded');
