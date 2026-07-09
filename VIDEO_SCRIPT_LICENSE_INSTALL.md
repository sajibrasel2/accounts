# 🎥 Video Script: License Key Installation Guide

## Target Audience: POS System Clients (Non-Technical Users)

## Video Length: 3-5 minutes

## Language: Bengali (বাংলা)

---

## 📝 VIDEO STRUCTURE

### 1. INTRO (0:00 - 0:20)

**[Screen: Sajib Digital Hub Logo Animation]**

**Voice Over:**
> আসসালামু আলাইকুম! 
> 
> আমি সাজিব, Sajib Digital Hub থেকে।
> 
> আজকে দেখাবো কিভাবে আপনার POS Billing System এ License Key install করবেন।
> 
> একদম সহজ! মাত্র 5 মিনিট লাগবে।

**[Text on Screen: "License Key Installation - সহজ পদ্ধতি"]**

---

### 2. WHAT YOU WILL NEED (0:20 - 0:40)

**[Screen: Show checklist]**

**Voice Over:**
> শুরু করার আগে নিশ্চিত করুন:
> 
> ✅ POS System আপনার computer এ install করা আছে
> 
> ✅ License key পেয়েছেন WhatsApp বা Facebook এ
> 
> ✅ আপনার কাছে Notepad আছে
> 
> চলুন শুরু করি!

---

### 3. STEP 1: FIND THE .ENV FILE (0:40 - 1:30)

**[Screen Record: Open Windows File Explorer]**

**Voice Over:**
> প্রথম step: .env ফাইল খুঁজে বের করা।
> 
> [Open Explorer] আপনার POS System folder খুলুন।
> 
> আমার ক্ষেত্রে এটা Desktop এ আছে।

**[Show folder location]**

> এখন .env ফাইল খুঁজুন।
> 
> যদি দেখা না যায়, তাহলে hidden files দেখাতে হবে।

**[Click View → Show → Hidden items]**

> View এ ক্লিক করুন → Show → Hidden items check করুন।
> 
> এখন .env ফাইল দেখা যাচ্ছে!

**[Highlight .env file with cursor]**

> এই হলো আমাদের ফাইল। এটাতেই license key বসাতে হবে।

---

### 4. STEP 2: OPEN .ENV FILE (1:30 - 2:00)

**[Screen Record: Right-click .env → Open with → Notepad]**

**Voice Over:**
> এখন .env ফাইলে right click করুন।
> 
> [Right-click] Open with → Notepad select করুন।
> 
> ফাইল খুলে গেলো!

**[Show full .env file content]**

> দেখুন, এখানে অনেকগুলো line আছে।
> 
> আমাদের শুধু 3টি line পরিবর্তন করতে হবে।

---

### 5. STEP 3: FIND LICENSE SECTION (2:00 - 2:30)

**[Screen Record: Scroll down to LICENSE CONFIGURATION section]**

**Voice Over:**
> এখন scroll করে নিচে যান।
> 
> LICENSE CONFIGURATION section খুঁজুন।

**[Highlight LICENSE CONFIGURATION section]**

> এই দেখুন! এখানেই আমাদের কাজ।
> 
> এই 3টি line আমরা পরিবর্তন করব:
> 
> 1. LICENSE_CLIENT_NAME
> 2. LICENSE_KEY
> 3. LICENSE_EXPIRY

**[Circle each line with cursor]**

---

### 6. STEP 4: GET LICENSE FROM MESSAGE (2:30 - 3:00)

**[Screen: Show WhatsApp message with license key]**

**Voice Over:**
> এখন আপনার WhatsApp বা Facebook message খুলুন।
> 
> যেখানে আমি license পাঠিয়েছি।

**[Show full license message]**

> এই দেখুন message টা!
> 
> এখানে 3টি তথ্য আছে:
> 
> • Client Name: রাসেল সাহেব
> • License Key: SAJIB-ABC12345-XYZ67890
> • Expiry: 2025-01-31

**[Highlight each field]**

> এগুলো আমরা copy করব।

---

### 7. STEP 5: COPY AND PASTE (3:00 - 4:00)

**[Screen: Split screen - WhatsApp left, Notepad right]**

**Voice Over:**
> এখন একটা একটা করে copy-paste করি।
> 
> প্রথমে Client Name:

**[Select "রাসেল সাহেব" → Ctrl+C → Paste in LICENSE_CLIENT_NAME]**

> Message থেকে copy করুন → .env এ paste করুন।
> 
> Demo User এর জায়গায় আপনার নাম বসান।

**[Before: LICENSE_CLIENT_NAME=Demo User]**
**[After: LICENSE_CLIENT_NAME=রাসেল সাহেব]**

> একইভাবে License Key:

**[Select license key → Ctrl+C → Paste in LICENSE_KEY]**

**[Before: LICENSE_KEY=DEMO-KEY-EXPIRES-SOON]**
**[After: LICENSE_KEY=SAJIB-ABC12345-XYZ67890]**

> এবং সবশেষে Expiry Date:

**[Select date → Ctrl+C → Paste in LICENSE_EXPIRY]**

**[Before: LICENSE_EXPIRY=2025-01-31]**
**[After: LICENSE_EXPIRY=2025-01-31]**

> ⚠️ খেয়াল রাখবেন:
> 
> • = এর আগে-পরে কোন space নেই
> • Spelling ঠিক আছে
> • তারিখ YYYY-MM-DD format এ আছে

---

### 8. STEP 6: SAVE FILE (4:00 - 4:20)

**[Screen Record: File → Save or Ctrl+S]**

**Voice Over:**
> এখন File Save করুন।
> 
> File → Save এ ক্লিক করুন।
> 
> অথবা Ctrl+S চাপুন।

**[Show "Saved" indicator]**

> ব্যস! File save হয়ে গেছে।
> 
> এখন Notepad close করতে পারেন।

---

### 9. STEP 7: RESTART SERVER (4:20 - 5:00)

**[Screen Record: Command Prompt]**

**Voice Over:**
> এখন সবচেয়ে গুরুত্বপূর্ণ step: Server restart।
> 
> Command Prompt খুলুন।

**[Open Command Prompt]**

> যদি server চলছে, Ctrl+C চেপে বন্ধ করুন।

**[Press Ctrl+C → Server stops]**

> এখন POS folder এ যান:

**[Type: cd Desktop\POS-System]**

> এবং server চালান:

**[Type: node server.js]**

**[Show server starting logs]**

> দেখুন! Server চালু হচ্ছে...
> 
> অপেক্ষা করুন...

**[Show license validation message]**

> এই দেখুন!
> 
> ✅ LICENSE VALID
>    Client: রাসেল সাহেব
>    Expires: 31 January 2025

**[Highlight the success message]**

> Perfect! License activate হয়ে গেছে!

---

### 10. STEP 8: VERIFY IN BROWSER (5:00 - 5:30)

**[Screen Record: Open browser → localhost:3000]**

**Voice Over:**
> এখন browser খুলে verify করি।
> 
> localhost:3000 এ যান।

**[Show POS System loading]**

> দেখুন! System পুরোপুরি unlock হয়ে গেছে!
> 
> কোন warning নেই, কোন error নেই।

**[Navigate through tabs: Dashboard, Create Bill, Clients]**

> সব feature এখন চলছে perfectly!
> 
> আপনি এখন bill generate করতে পারবেন,
> WhatsApp পাঠাতে পারবেন,
> Client manage করতে পারবেন।

---

### 11. COMMON MISTAKES (5:30 - 6:00)

**[Screen: Show error examples]**

**Voice Over:**
> যদি error দেখায়, এই ভুলগুলো check করুন:

**[Show wrong examples with red X]**

> ❌ LICENSE_KEY = SAJIB-... (space আছে)
> ❌ License key spelling ভুল
> ❌ তারিখ 31-01-2025 format এ (ভুল!)
> ❌ File save করেননি
> ❌ Server restart করেননি

**[Show correct examples with green checkmark]**

> ✅ LICENSE_KEY=SAJIB-... (কোন space নেই)
> ✅ হুবহু copy-paste করুন
> ✅ তারিখ 2025-01-31 format এ
> ✅ File save করুন (Ctrl+S)
> ✅ Server restart করুন

---

### 12. TROUBLESHOOTING (6:00 - 6:30)

**[Screen: Show troubleshooting steps]**

**Voice Over:**
> তবুও সমস্যা হলে কি করবেন?
> 
> 1. .env ফাইল আবার check করুন
> 2. Message থেকে আবার copy-paste করুন
> 3. File save করেছেন কিনা দেখুন
> 4. Server restart করুন
> 
> এরপরও সমস্যা হলে:

**[Show contact information]**

> 📱 WhatsApp করুন: 01739354392
> 💬 Facebook: @sajibrasel2
> 📧 Email: raselsajib25@gmail.com
> 
> Screen recording পাঠান, সাথে সাথে সমাধান পাবেন!

---

### 13. LICENSE RENEWAL (6:30 - 7:00)

**[Screen: Show renewal process]**

**Voice Over:**
> মেয়াদ শেষ হওয়ার 7 দিন আগে warning পাবেন।
> 
> Renewal করতে চাইলে:
> 
> 1. WhatsApp করুন: 01739354392
> 2. আপনার নাম এবং license key দিন
> 3. Payment করুন (bKash/Nagad/Rocket)
> 4. নতুন license পাবেন
> 5. একইভাবে install করুন

**[Show pricing]**

> Renewal Price:
> • 1 মাস: ৳500
> • 3 মাস: ৳1,200
> • 6 মাস: ৳2,000
> • 1 বছর: ৳3,000

---

### 14. OUTRO (7:00 - 7:30)

**[Screen: Sajib Digital Hub Logo with contact info]**

**Voice Over:**
> তো এভাবেই license key install করতে হয়।
> 
> একদম সহজ, তাই না?
> 
> কোন সমস্যা হলে যোগাযোগ করুন:
> 
> 📱 WhatsApp: 01739354392
> 💬 Facebook: fb.com/sajibrasel2
> 📧 Email: raselsajib25@gmail.com
> 🌐 YouTube: @sajibrasel2
> 
> Video টা helpful লাগলে Like করুন,
> Share করুন,
> এবং Subscribe করুন!
> 
> আরো tutorial পেতে bell icon টা press করুন।
> 
> আপনার ব্যবসার সফলতা কামনা করছি!
> 
> ধন্যবাদ, আল্লাহ হাফেজ!

**[Text on Screen: "✨ Sajib Digital Hub ✨"]**
**[Text on Screen: "Making Business Easy with Technology"]**

**[Fade to black]**

---

## 🎬 VIDEO PRODUCTION NOTES

### Equipment Needed:
- Screen recording software (OBS Studio / Camtasia / Bandicam)
- Microphone (clear audio is important!)
- Video editing software (Filmora / Adobe Premiere / DaVinci Resolve)

### Recording Tips:
1. **Clear Screen**: Close unnecessary windows
2. **Font Size**: Increase Notepad font to 14-16pt for visibility
3. **Cursor Highlight**: Use cursor highlighting tool (PowerPoint Cursor Highlighter)
4. **Slow Movements**: Move cursor slowly for viewers to follow
5. **Zoom In**: Zoom on important sections (license lines)
6. **Voice**: Speak clearly and slowly in Bengali
7. **Pauses**: Give 2-3 seconds pause after each step

### Editing Tips:
1. **Intro Music**: Use royalty-free upbeat music (Epidemic Sound)
2. **Text Overlays**: Add Bengali subtitles for clarity
3. **Arrows/Highlights**: Point to important buttons/fields
4. **Zoom Effects**: Zoom in on license key when copying
5. **Color Coding**: Red for errors, Green for success
6. **Transitions**: Smooth transitions between steps
7. **Background Music**: Soft instrumental during tutorial (lower volume than voice)

### Thumbnails Ideas:
```
Option 1:
[Big text: "License Key Install"]
[Subtitle: "মাত্র 5 মিনিট!"]
[Image: License key icon + Computer screen]
[Your face with pointing gesture]

Option 2:
[Split screen: Before (❌) and After (✅)]
[Text: "Demo → Full Unlock"]
[Bright colors: Green/Blue gradient]

Option 3:
[Step-by-step visual: 1→2→3]
[Text: "সহজ পদ্ধতি"]
[WhatsApp icon + Computer icon + Checkmark]
```

---

## 📋 VIDEO CHECKLIST

Before uploading, verify:

- [ ] Audio is clear and loud enough
- [ ] Screen recording is 1080p or higher
- [ ] No sensitive information visible (passwords, personal data)
- [ ] All steps shown clearly
- [ ] Bengali voice over is correct
- [ ] Subtitles added (Bengali + English)
- [ ] Intro/Outro added
- [ ] Background music is balanced
- [ ] Contact information displayed clearly
- [ ] Thumbnail is attractive and clear
- [ ] Video title is SEO-friendly
- [ ] Description includes all steps and links
- [ ] Tags added (POS, License, Installation, Bengali Tutorial)

---

## 📝 YOUTUBE VIDEO DETAILS

### Title (Bengali):
```
POS Billing System এ License Key Install করার সহজ পদ্ধতি | Sajib Digital Hub
```

### Title (English):
```
How to Install License Key in POS Billing System | Easy Tutorial in Bengali
```

### Description:
```
আসসালামু আলাইকুম! 

এই video তে দেখানো হয়েছে কিভাবে POS Billing System এ License Key install করবেন - একদম সহজ পদ্ধতিতে, মাত্র 5 মিনিটে!

📌 Video Contents:
0:00 - Intro
0:20 - Requirements
0:40 - Step 1: Find .env File
1:30 - Step 2: Open with Notepad
2:00 - Step 3: Find License Section
2:30 - Step 4: Get License from Message
3:00 - Step 5: Copy and Paste
4:00 - Step 6: Save File
4:20 - Step 7: Restart Server
5:00 - Step 8: Verify in Browser
5:30 - Common Mistakes to Avoid
6:00 - Troubleshooting
6:30 - License Renewal Process
7:00 - Outro

🔗 Useful Links:
• POS System Demo: http://localhost:3000
• Installation Guide (PDF): [আপনার link]
• Facebook Page: fb.com/sajibrasel2
• WhatsApp Support: 01739354392

📞 যোগাযোগ করুন:
• WhatsApp: 01739354392
• Facebook: fb.com/sajibrasel2
• Email: raselsajib25@gmail.com

💰 License Price:
• 1 মাস: ৳500
• 3 মাস: ৳1,200 (সাশ্রয় ৳300)
• 6 মাস: ৳2,000 (সাশ্রয় ৳1,000)
• 1 বছর: ৳3,000 (সাশ্রয় ৳3,000)

🎯 Hashtags:
#POSSystem #LicenseKey #BillingSystem #Tutorial #Bengali #SajibDigitalHub #Business #WhatsApp #Automation #TechTutorial

আপনার ব্যবসার সফলতা কামনা করছি! 🚀

✨ Sajib Digital Hub ✨
Making Business Easy with Technology

© 2024-2026 | Made with ❤️ in Bangladesh
```

### Tags:
```
POS System, License Key, Installation Tutorial, Bengali Tutorial, Billing System, WhatsApp Automation, Business Software, Sajib Digital Hub, বাংলা টিউটোরিয়াল, লাইসেন্স ইনস্টল, ব্যবসা সফটওয়্যার, পয়েন্ট অফ সেল, Invoice System, Localhost Software, Node.js Tutorial
```

---

## 🎉 BONUS: Short Version (1 Minute)

For Facebook/Instagram Reels:

**Quick Steps:**
1. Open .env file (0:00-0:10)
2. Find LICENSE section (0:10-0:20)
3. Copy from message (0:20-0:35)
4. Paste in .env (0:35-0:45)
5. Save & Restart (0:45-0:55)
6. Success! (0:55-1:00)

**Text Overlay:**
"License Key Install - মাত্র 1 মিনিট!"

---

**✨ Sajib Digital Hub ✨**  
*Making Business Easy with Technology*

© 2024-2026 | Made with ❤️ in Bangladesh
