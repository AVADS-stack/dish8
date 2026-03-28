# Dish8 — Hosting & Deployment Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A domain name (optional but recommended for production)

---

## Option 1: Vercel (Recommended — Free Tier Available)

Vercel is the easiest and fastest way to deploy a React/Vite app.

### Step-by-Step:

1. **Create a Vercel account**
   - Go to https://vercel.com and sign up (free tier available)
   - Connect your GitHub/GitLab/Bitbucket account

2. **Push your code to Git**
   ```bash
   cd /path/to/dish8
   git init
   git add .
   git commit -m "Initial commit - Dish8 app"
   git remote add origin https://github.com/YOUR_USERNAME/dish8.git
   git push -u origin main
   ```

3. **Import project in Vercel**
   - Go to https://vercel.com/new
   - Select your repository
   - Vercel auto-detects Vite — no configuration needed
   - Click "Deploy"

4. **Configure custom domain (optional)**
   - Go to your project settings → Domains
   - Add your domain (e.g., dish8.com)
   - Update your DNS records as instructed by Vercel:
     - Add an A record pointing to `76.76.21.21`
     - Or add a CNAME record pointing to `cname.vercel-dns.com`

5. **Auto-deploys**: Every push to `main` auto-deploys. Done!

### Vercel CLI (Alternative)
```bash
npm install -g vercel
cd /path/to/dish8
vercel
# Follow prompts — deployed in ~30 seconds
```

---

## Option 2: Netlify (Free Tier Available)

### Step-by-Step:

1. **Create a Netlify account**
   - Go to https://netlify.com and sign up

2. **Build locally**
   ```bash
   cd /path/to/dish8
   npm install
   npm run build
   ```

3. **Deploy via drag-and-drop**
   - Go to https://app.netlify.com/drop
   - Drag the `dist/` folder onto the page
   - Your site is live immediately!

4. **Or deploy via CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod --dir=dist
   ```

5. **Configure for SPA routing** — Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```
   Then rebuild: `npm run build`

6. **Custom domain**
   - Go to Site settings → Domain management → Add custom domain
   - Follow DNS instructions provided

---

## Option 3: GitHub Pages (Free)

### Step-by-Step:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `vite.config.js`** — add base path:
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/dish8/',  // your repo name
   })
   ```

3. **Add deploy script to `package.json`**:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

4. **Create `public/404.html`** (for SPA routing):
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <script>
       const path = window.location.pathname;
       window.location.replace('/dish8/' + '?p=' + path);
     </script>
   </head>
   </html>
   ```

5. **Deploy**
   ```bash
   git init
   git remote add origin https://github.com/YOUR_USERNAME/dish8.git
   npm run deploy
   ```

6. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Set source to `gh-pages` branch
   - Your site is at `https://YOUR_USERNAME.github.io/dish8/`

---

## Option 4: Cloudflare Pages (Free Tier — Fast Global CDN)

### Step-by-Step:

1. **Create Cloudflare account**
   - Go to https://dash.cloudflare.com and sign up

2. **Connect your Git repo**
   - Go to Workers & Pages → Create → Pages → Connect to Git
   - Select your repository

3. **Configure build settings**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Click "Save and Deploy"

4. **Custom domain**
   - If your domain is on Cloudflare, it auto-configures
   - Otherwise, add a CNAME record pointing to `<project>.pages.dev`

---

## Option 5: Firebase Hosting (Google — Free Tier)

### Step-by-Step:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase**
   ```bash
   cd /path/to/dish8
   firebase init hosting
   ```
   - Select "Use an existing project" or create new
   - Public directory: `dist`
   - Configure as single-page app: **Yes**
   - Set up automatic builds: No

3. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

4. **Custom domain**
   - Go to Firebase Console → Hosting → Add custom domain
   - Follow DNS verification steps

---

## Option 6: AWS S3 + CloudFront (Production-Grade)

### Step-by-Step:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Create an S3 bucket**
   ```bash
   aws s3 mb s3://dish8-website
   aws s3 website s3://dish8-website --index-document index.html --error-document index.html
   ```

3. **Upload the build**
   ```bash
   aws s3 sync dist/ s3://dish8-website --delete
   ```

4. **Set bucket policy for public read**
   ```json
   {
     "Statement": [{
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::dish8-website/*"
     }]
   }
   ```

5. **Create CloudFront distribution**
   - Origin: S3 bucket website endpoint
   - Default root object: `index.html`
   - Custom error response: 404 → `/index.html` (200) for SPA routing
   - Enable HTTPS with AWS Certificate Manager

6. **Custom domain**
   - Request SSL certificate in ACM (us-east-1 region)
   - Add CNAME record for your domain → CloudFront distribution

---

## Option 7: DigitalOcean App Platform (Simple VPS)

### Step-by-Step:

1. **Create a DigitalOcean account** at https://digitalocean.com

2. **Create a new App**
   - Go to Apps → Create App
   - Connect your GitHub repo
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Deploy** — Click "Create Resources"

4. **Custom domain** — Add in App settings → Domains

---

## Running on Your Own Server (Current Setup)

If you're running on your own Linux server (like now):

1. **Development mode** (for testing):
   ```bash
   cd /storage2/aveerappa/website
   npm run dev
   # Access at http://YOUR_SERVER_IP:5173
   ```

2. **Production mode with preview server**:
   ```bash
   npm run build
   npm run preview -- --host 0.0.0.0 --port 4173
   # Access at http://YOUR_SERVER_IP:4173
   ```

3. **Production mode with nginx** (recommended):
   ```bash
   # Build
   npm run build

   # Install nginx
   sudo apt install nginx

   # Copy build to nginx
   sudo cp -r dist/* /var/www/html/

   # Configure nginx for SPA routing
   sudo nano /etc/nginx/sites-available/default
   ```

   Add this nginx config:
   ```nginx
   server {
       listen 80;
       server_name dish8.com www.dish8.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Add HTTPS with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d dish8.com -d www.dish8.com
   ```

---

## Environment Checklist

Before deploying to production:

- [ ] Update `vite.config.js` base path if not deploying to root
- [ ] Ensure `server.host` is set to `'0.0.0.0'` for server deployments
- [ ] Build with `npm run build` and test with `npm run preview`
- [ ] Set up proper DNS records for your domain
- [ ] Enable HTTPS/SSL
- [ ] Test all routes work (SPA routing requires server config)
- [ ] Clear browser localStorage if testing with old data
