# 🚀 FIREBASE DEPLOYMENT - EASY STEPS

## What Was Just Created

✅ **firebase.json** - Firebase hosting configuration file

This file tells Firebase:
- Where your files are (current directory)
- Which files to ignore (.md, .iml, etc)
- How to handle routing (send all requests to index.html)

## How to Deploy (2 Steps)

### Step 1: Authenticate with Firebase
Open PowerShell and run:
```powershell
npx -y firebase-tools login
```

This will:
1. Open your browser
2. Ask you to sign in with Google
3. Click "Allow" to authorize
4. You'll see a success message

### Step 2: Deploy
After authentication, run:
```powershell
cd C:\Users\User\Learning\church_finance
npx -y firebase-tools deploy
```

This will upload your files to Firebase hosting.

**DONE!** 🎉

You'll see output like:
```
Hosting URL: https://bca-church-finance.web.app
```

Visit that URL to see your app live!

---

## What Each File Does

- **firebase.json** - Configuration (JUST CREATED)
- **firebase.js** - Firebase SDK initialization
- **app.js** - Your application logic
- **index.html** - Main HTML file
- **style.css** - Styling
- **utils.js** - Utility functions
- **auth.js** - Authentication

All set! 🚀

