# Git and Vercel Deployment Guide

## Step 1: Push to GitHub

Since you mentioned you already have a GitHub repository, run these commands:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Or if you use SSH:
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# Push your code to GitHub
git push -u origin master

# Or if your default branch is 'main':
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Add environment variables:
   - Variable name: `MONGO_URI`
   - Value: Your MongoDB connection string (Atlas or other cloud MongoDB)
6. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from the root directory
vercel

# Follow the prompts and add environment variables when asked
```

## Important: MongoDB for Production

For production deployment, you need a cloud MongoDB instance:

### MongoDB Atlas Setup (Free tier available):

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel
5. Get your connection string
6. Add it to Vercel environment variables as `MONGO_URI`

Example connection string:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bloggingDB?retryWrites=true&w=majority
```

## Future Updates

After making changes to your code:

```bash
# Stage all changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push

# Vercel will automatically redeploy if connected to GitHub
# Or manually deploy with: vercel --prod
```

## Vercel Environment Variables

Make sure to add these in Vercel Dashboard:

- `MONGO_URI` - Your MongoDB connection string

## Notes

- The `.env` file is excluded from git (see `.gitignore`)
- Never commit sensitive information like passwords
- Use `.env.example` as a template for environment variables
- Vercel automatically uses the `vercel.json` configuration
