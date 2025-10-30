# MongoDB Atlas Setup Guide

## Quick Setup Steps

### 1. Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google/GitHub
3. Select **FREE** tier (M0 Sandbox - 512MB storage)

### 2. Create a Cluster

1. Choose **AWS** as cloud provider (or any)
2. Select a region close to your Vercel deployment (e.g., US East)
3. Cluster name: `Cluster0` (default is fine)
4. Click **Create Cluster** (takes 3-5 minutes)

### 3. Create Database User

1. Click **Database Access** in left sidebar
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `blogadmin` (or your choice)
5. Password: Generate a strong password (SAVE THIS!)
6. Database User Privileges: **Read and write to any database**
7. Click **Add User**

### 4. Configure Network Access

1. Click **Network Access** in left sidebar
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. This is required for Vercel deployment
5. Click **Confirm**

### 5. Get Connection String

1. Go back to **Database** (left sidebar)
2. Click **Connect** button on your cluster
3. Choose **Connect your application**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://blogadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add your database name before the `?`:
   ```
   mongodb+srv://blogadmin:yourpassword@cluster0.xxxxx.mongodb.net/bloggingDB?retryWrites=true&w=majority
   ```

### 6. Test Connection Locally (Optional)

1. Update your `server/.env` file:
   ```
   MONGO_URI=mongodb+srv://blogadmin:yourpassword@cluster0.xxxxx.mongodb.net/bloggingDB?retryWrites=true&w=majority
   ```
2. Restart your server:
   ```bash
   cd server
   node server.js
   ```
3. Test creating a post at http://localhost:5000

### 7. Add to Vercel

You'll add this connection string to Vercel as an environment variable in the next step.

## Important Notes

- ⚠️ **Never commit** your real MongoDB connection string to GitHub
- ⚠️ Keep your password secure
- ✅ The free tier (512MB) is enough for thousands of blog posts
- ✅ You can upgrade later if needed

## Troubleshooting

**Can't connect?**

- Make sure IP whitelist includes `0.0.0.0/0`
- Verify username and password are correct
- Check that database name is included in connection string

**Connection timeout?**

- Network access might not be configured
- Try different region closer to you

---

Once you have your MongoDB Atlas connection string, we'll add it to Vercel and complete the deployment!
