// =========================================================
// Electron Main Process - POS Billing Desktop Application
// Sajib Digital Hub | Professional Desktop Software
// =========================================================

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');

let mainWindow = null;
let serverProcess = null;
let isServerRunning = false;
const SERVER_PORT = 3000;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

// =========================================================
// Server Management Functions
// =========================================================

/**
 * Start the Express server in background
 */
function startExpressServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting Express server...');
    
    // Start server.js as a child process
    serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        ELECTRON_APP: 'true' // Flag to indicate running in Electron
      }
    });

    // Handle server stdout
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Server] ${output.trim()}`);
      
      // Check if server started successfully
      if (output.includes('Server is running') || output.includes('Server started')) {
        isServerRunning = true;
        console.log('✅ Express server started successfully');
        resolve();
      }
    });

    // Handle server stderr
    serverProcess.stderr.on('data', (data) => {
      const error = data.toString();
      console.error(`[Server Error] ${error.trim()}`);
    });

    // Handle server exit
    serverProcess.on('exit', (code, signal) => {
      isServerRunning = false;
      console.log(`❌ Express server exited with code ${code} and signal ${signal}`);
      
      if (code !== 0 && code !== null) {
        reject(new Error(`Server exited with code ${code}`));
      }
    });

    // Handle server errors
    serverProcess.on('error', (error) => {
      isServerRunning = false;
      console.error('❌ Failed to start Express server:', error);
      reject(error);
    });

    // Give server 5 seconds to start
    setTimeout(() => {
      if (!isServerRunning) {
        console.log('⏰ Server taking longer than expected, checking manually...');
        checkServerHealth()
          .then(() => {
            isServerRunning = true;
            resolve();
          })
          .catch(reject);
      }
    }, 5000);
  });
}

/**
 * Stop the Express server gracefully
 */
function stopExpressServer() {
  return new Promise((resolve) => {
    if (serverProcess) {
      console.log('🛑 Stopping Express server...');
      
      // Try graceful shutdown first (SIGTERM)
      serverProcess.kill('SIGTERM');
      
      // Force kill after 5 seconds if not stopped
      setTimeout(() => {
        if (serverProcess && !serverProcess.killed) {
          console.log('⚠️  Forcing server shutdown...');
          serverProcess.kill('SIGKILL');
        }
        resolve();
      }, 5000);
    } else {
      resolve();
    }
  });
}

/**
 * Check if server is healthy and responding
 */
async function checkServerHealth() {
  try {
    const response = await axios.get(`${SERVER_URL}/api/settings`, {
      timeout: 3000
    });
    return response.status === 200;
  } catch (error) {
    throw new Error('Server health check failed');
  }
}

/**
 * Wait for server to be ready (with retry logic)
 */
async function waitForServer(maxRetries = 20, delayMs = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`🔄 Checking server... Attempt ${i + 1}/${maxRetries}`);
      await checkServerHealth();
      console.log('✅ Server is ready!');
      return true;
    } catch (error) {
      if (i === maxRetries - 1) {
        throw new Error('Server failed to start after maximum retries');
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  return false;
}

// =========================================================
// Window Management Functions
// =========================================================

/**
 * Create the main application window
 */
function createMainWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: '#1a1a2e',
    icon: path.join(__dirname, 'public', 'icon.png'), // Add your icon
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js') // For secure IPC if needed
    },
    show: false, // Don't show until ready
    autoHideMenuBar: true, // Hide menu bar (can be toggled with Alt key)
    frame: true, // Keep window frame for native look
    titleBarStyle: 'default'
  });

  // Remove/hide default Electron menu
  Menu.setApplicationMenu(null);

  // Load the local server URL
  mainWindow.loadURL(SERVER_URL);

  // Show window when ready to avoid flicker
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize(); // Start maximized for POS experience
    console.log('✅ Application window displayed');
  });

  // Handle window close
  mainWindow.on('close', async (event) => {
    if (isServerRunning) {
      event.preventDefault();
      
      console.log('🔄 Shutting down application...');
      
      // Show closing message
      mainWindow.webContents.executeJavaScript(`
        alert('Closing application... Please wait.');
      `);
      
      // Stop server gracefully
      await stopExpressServer();
      
      // Quit application
      app.quit();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open DevTools in development mode (comment out in production)
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle navigation errors (e.g., server not ready)
  mainWindow.webContents.on('did-fail-load', async (event, errorCode, errorDescription) => {
    console.error(`❌ Failed to load: ${errorDescription}`);
    
    // Retry loading after a delay
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.loadURL(SERVER_URL);
      }
    }, 2000);
  });

  // Prevent external navigation (security)
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(SERVER_URL)) {
      event.preventDefault();
      console.warn(`⚠️  Blocked navigation to external URL: ${url}`);
    }
  });

  // Handle new window requests (open in default browser)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

/**
 * Show error dialog
 */
function showErrorDialog(title, message) {
  dialog.showErrorBox(title, message);
}

/**
 * Show loading splash screen
 */
function createSplashWindow() {
  const splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    center: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Simple HTML splash screen
  splash.loadURL(`data:text/html;charset=utf-8,
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .container {
            text-align: center;
            padding: 30px;
          }
          h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          p {
            font-size: 16px;
            opacity: 0.9;
            margin: 10px 0;
          }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🏢 POS Billing System</h1>
          <p>Sajib Digital Hub</p>
          <div class="spinner"></div>
          <p>Starting application...</p>
        </div>
      </body>
    </html>
  `);

  return splash;
}

// =========================================================
// Application Lifecycle
// =========================================================

/**
 * Initialize application
 */
async function initializeApp() {
  try {
    console.log('╔═══════════════════════════════════════════════════╗');
    console.log('║     POS Billing Desktop Application v3.0.0       ║');
    console.log('║            Sajib Digital Hub                      ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');

    // Show splash screen
    const splash = createSplashWindow();

    // Start Express server
    console.log('🚀 Step 1: Starting Express server...');
    await startExpressServer();

    // Wait for server to be healthy
    console.log('🔄 Step 2: Waiting for server to be ready...');
    await waitForServer();

    // Create main window
    console.log('🪟 Step 3: Creating application window...');
    createMainWindow();

    // Close splash after window is shown
    setTimeout(() => {
      if (splash && !splash.isDestroyed()) {
        splash.close();
      }
    }, 1000);

    console.log('✅ Application initialized successfully!\n');
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    
    showErrorDialog(
      'Application Startup Error',
      `Failed to start the application:\n\n${error.message}\n\nPlease ensure:\n1. XAMPP MySQL is running\n2. Port 3000 is not in use\n3. Node.js dependencies are installed (npm install)`
    );
    
    app.quit();
  }
}

// =========================================================
// Electron App Events
// =========================================================

// App ready - start initialization
app.whenReady().then(() => {
  initializeApp();

  // macOS specific: re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// All windows closed
app.on('window-all-closed', async () => {
  // Stop server
  await stopExpressServer();
  
  // Quit app (even on macOS)
  app.quit();
});

// Before quit - cleanup
app.on('before-quit', async (event) => {
  if (isServerRunning) {
    event.preventDefault();
    await stopExpressServer();
    app.quit();
  }
});

// Handle unhandled errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  dialog.showErrorBox(
    'Application Error',
    `An unexpected error occurred:\n\n${error.message}`
  );
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// =========================================================
// IPC Handlers (for renderer to main communication)
// =========================================================

ipcMain.handle('get-server-status', async () => {
  return {
    running: isServerRunning,
    url: SERVER_URL
  };
});

ipcMain.handle('restart-server', async () => {
  await stopExpressServer();
  await startExpressServer();
  await waitForServer();
  return { success: true };
});

console.log('✅ Electron main process loaded');
