# Railway Environment Variables Setup Guide

## 🚨 IMPORTANT: Your app needs these environment variables to work properly!

Based on your health check, these variables are missing:
- ❌ NEXTAUTH_SECRET: false
- ❌ NEXTAUTH_URL: not-set  
- ❌ DATABASE_URL: false

## 📋 Step-by-Step Instructions:

### 1. Go to Railway Dashboard
- Open: https://railway.app/dashboard
- Login if prompted

### 2. Find Your Project
- Look for project named: **Buyer_Leads**
- Click on it

### 3. Select Your Service
- You should see your deployed service
- Click on the service (not the GitHub repo icon)

### 4. Go to Variables Tab
- Look for tabs like: Overview, Settings, Variables, Logs
- Click on **"Variables"** tab

### 5. Add These 3 Environment Variables

**Variable 1:**
```
Name: NEXTAUTH_SECRET
Value: u3aKvo9PSOTuf2xgqqrOSxVQNEsDxjOlofAd0KXw66s=
```

**Variable 2:**
```
Name: NEXTAUTH_URL  
Value: https://buyerleads-production.up.railway.app
```

**Variable 3:**
```
Name: DATABASE_URL
Value: file:./sqlite.db
```

### 6. Save Each Variable
- Click "Add Variable" or "+" button
- Enter the name and value
- Click "Save" or "Add"
- Repeat for all 3 variables

### 7. Wait for Deployment
- Railway will automatically redeploy (2-3 minutes)
- You'll see deployment progress

## ✅ Test After Deployment

Check this URL again: https://buyerleads-production.up.railway.app/api/health

You should see:
```json
{
  "variables": {
    "NEXTAUTH_SECRET": true,
    "NEXTAUTH_URL": "https://buyerleads-production.up.railway.app", 
    "DATABASE_URL": true
  }
}
```

## 🆘 Need Help?

If you can't find the Variables tab or need assistance:
1. Take a screenshot of your Railway dashboard
2. Look for "Environment Variables" or "Config Vars" section
3. The interface might say "Environment" instead of "Variables"

Your app will work perfectly once these 3 variables are set! 🚀