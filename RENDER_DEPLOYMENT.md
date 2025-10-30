# Deploy to Render

This guide will help you deploy your blog to Render.

## Quick Deploy Steps:

1. **Sign up/Login to Render**: https://render.com
2. **Create New Web Service**
3. **Connect GitHub Repository**: `Himanshuyadav6764/blog_posting`
4. **Configure Settings**:

   - **Name**: `blogging-system`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
   - **Instance Type**: `Free`

5. **Add Environment Variable**:

   - Key: `MONGO_URI`
   - Value: `mongodb+srv://yadavhimanshu88272_db_user:Majar@123@cluster0.mfempxz.mongodb.net/bloggingDB?retryWrites=true&w=majority`

6. **Deploy!**

## Alternative: Auto-Deploy with render.yaml

Render will automatically detect the `render.yaml` file in your repository and configure everything for you!

## Your MongoDB Details:

- ✅ IP Whitelist: 0.0.0.0/0 (allows all)
- ✅ Username: yadavhimanshu88272_db_user
- ✅ Password: Majar@123
- ✅ Database: bloggingDB

## Benefits of Render over Vercel:

- ✅ No authentication protection issues
- ✅ Better for backend APIs
- ✅ Always-on free tier (Vercel has cold starts)
- ✅ Simpler MongoDB connection
- ✅ Built-in environment variables

## After Deployment:

Your blog will be available at: `https://blogging-system.onrender.com`
