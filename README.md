# Modern Blog Platform

A beautiful, modern blogging system built with Express.js, MongoDB, and vanilla JavaScript.

## Features

- ✨ Modern, responsive UI with dark/light theme
- 📝 Create, read, and delete blog posts
- 🔍 Real-time search functionality
- 🎨 Beautiful animations and transitions
- 📱 Mobile-friendly design
- 🌙 Dark mode support

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: HTML, CSS, JavaScript
- **Icons**: Font Awesome

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd blogging-system
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `server` directory:

```
MONGO_URI=mongodb://localhost:27017/bloggingDB
```

4. Start MongoDB (if running locally)

5. Run the server:

```bash
cd server
node server.js
```

6. Open your browser at `http://localhost:5000`

## Deployment

### Vercel Deployment

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy:

```bash
vercel
```

4. Set environment variables in Vercel:
   - Go to your project settings
   - Add `MONGO_URI` with your MongoDB connection string

## API Endpoints

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `DELETE /api/posts/:id` - Delete a post

## License

MIT
