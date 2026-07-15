# 🏗️ Build Instructions - Create .exe Installer

**Complete guide to package your desktop application**

---

## 📋 Prerequisites

✅ Node.js installed  
✅ npm installed  
✅ Windows 10/11 (64-bit)  
✅ All dependencies installed (`npm install`)  

---

## 🚀 Quick Build

### **Step 1: Install Dependencies** (first time only)

```bash
npm install
```

### **Step 2: Build Installer**

```bash
npm run build:win
```

**Output:** `dist/POS Billing System-3.0.0-Setup.exe`

**File Size:** ~150-200 MB

**Build Time:** 2-5 minutes

---

## 📦 Build Options

### **Option 1: Full Installer (NSIS)**

```bash
npm run build:win
```

**Creates:**
- Installation wizard
- Desktop shortcut
- Start menu entry
- Uninstaller
- Auto-update support

**Best for:**
- Professional distribution
- Client installations
- Commercial use

### **Option 2: Portable .exe**

```bash
npm run build:portable
```

**Creates:**
- Single .exe file
- No installation needed
- Run from anywhere
- USB-friendly

**Best for:**
- Testing
- Personal use
- Quick demo

### **Option 3: Both**

```bash
npm run build
```

**Creates:**
- Installer: `POS Billing System-3.0.0-Setup.exe`
- Portable: `POS Billing System-3.0.0-Portable.exe`

---

## 🎨 Add Custom Icon (Optional)

### **Step 1: Create Icons**

Create a `build` folder:
```bash
mkdir build
```

### **Step 2: Add Icon Files**

Place these files in `build/` folder:
- `icon.ico` (256x256 for Windows)
- `icon.png` (512x512 for Linux)
- `icon.icns` (for macOS)

**Tools to create icons:**
- Online: https://convertio.co/png-ico/
- Windows: Paint.NET, GIMP
- Professional: Adobe Illustrator

### **Step 3: Rebuild**

```bash
npm run build:win
```

Icon will be included automatically!

---

## 🔧 Build Configuration

**Already configured in package.json:**

```json
"build": {
  "appId": "com.sajibdigitalhub.posbilling",
  "productName": "POS Billing System",
  "win": {
    "target": ["nsis", "portable"],
    "icon": "build/icon.ico"
  }
}
```

**Customize:**
- App name: Change `productName`
- App ID: Change `appId`
- Icon: Place in `build/icon.ico`

---

## 📂 Output Files Location

After build completes:

```
dist/
├── POS Billing System-3.0.0-Setup.exe     ← Installer
├── POS Billing System-3.0.0-Portable.exe  ← Portable
└── win-unpacked/                          ← Unpacked files (for testing)
```

---

## ✅ Test Your Build

### **Step 1: Test Portable Version**

```bash
# Navigate to dist folder
cd dist

# Run portable exe
"POS Billing System-3.0.0-Portable.exe"
```

**Verify:**
- ✅ Application opens
- ✅ Server starts automatically
- ✅ MySQL connects
- ✅ All features work

### **Step 2: Test Installer**

1. **Run installer:** `POS Billing System-3.0.0-Setup.exe`
2. **Follow installation wizard**
3. **Launch from desktop shortcut**
4. **Verify all features**

---

## 📱 Distribution Checklist

Before sharing with clients:

- [ ] Test installer on fresh Windows machine
- [ ] Verify all features work after installation
- [ ] Test WhatsApp connection
- [ ] Test MySQL auto-configuration
- [ ] Test license system
- [ ] Test print functionality
- [ ] Test backup system
- [ ] Create user manual
- [ ] Prepare installation guide
- [ ] Set license expiry dates

---

## 🔐 Code Signing (Advanced)

**For professional deployment, sign your .exe to avoid Windows warnings.**

### **Step 1: Get Certificate**

Purchase code signing certificate from:
- Sectigo (~$200/year)
- DigiCert (~$400/year)
- Comodo (~$200/year)

### **Step 2: Configure Signing**

Update `package.json`:

```json
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "your-password",
  "signDlls": true,
  "rfc3161TimeStampServer": "http://timestamp.digicert.com"
}
```

### **Step 3: Build Signed App**

```bash
npm run build:win
```

**Benefits:**
- No Windows SmartScreen warnings
- Professional appearance
- Increased user trust

---

## 📊 Build Performance

| Metric | Value |
|--------|-------|
| Build Time (First) | 3-5 minutes |
| Build Time (Rebuild) | 1-2 minutes |
| Output Size (Installer) | ~150 MB |
| Output Size (Portable) | ~180 MB |
| Installed Size | ~250 MB |

---

## 🆘 Troubleshooting

### **Issue: Build fails with "ENOENT" error**

**Solution:**
```bash
# Clean build cache
rm -rf dist
rm -rf node_modules/electron

# Reinstall
npm install

# Try again
npm run build:win
```

### **Issue: "electron-builder" not found**

**Solution:**
```bash
npm install -D electron-builder
npm run build:win
```

### **Issue: Icon not showing**

**Check:**
1. File exists: `build/icon.ico`
2. File format: 256x256 .ico
3. Rebuild: `npm run build:win`

### **Issue: Build too slow**

**Speed up:**
```bash
# Build without compression
npm run pack

# Or build directory only (no installer)
electron-builder --dir
```

### **Issue: Antivirus blocking**

**Solution:**
1. Temporarily disable antivirus
2. Add exclusion for project folder
3. Try building again
4. (Optional) Code sign your app

---

## 🎯 Build for Different Targets

### **Windows 32-bit**

```json
"win": {
  "target": ["nsis"],
  "arch": ["ia32"]
}
```

Then: `npm run build:win`

### **macOS (from Windows)**

```bash
npm run build -- --mac
```

**Note:** Requires Docker or macOS machine

### **Linux (from Windows)**

```bash
npm run build -- --linux
```

**Creates:** `.AppImage` and `.deb` files

---

## 📖 Additional Resources

**Electron Builder Docs:**
https://www.electron.build/

**Icon Generators:**
- https://convertio.co/png-ico/
- https://cloudconvert.com/png-to-icns
- https://icon-icons.com/

**Code Signing:**
- https://www.electron.build/code-signing
- https://www.digicert.com/

---

## 🎉 Success!

After building, you'll have:

✅ Professional installer (`.exe`)  
✅ Portable executable  
✅ Desktop shortcuts  
✅ Start menu entries  
✅ Uninstaller included  
✅ Ready for distribution  

**Your POS system is now a real desktop software! 🖥️💼✨**

---

**Developer:** Sajib Digital Hub  
**Contact:** 01739354392 | @sajibrasel2  
**Version:** 3.0.0
