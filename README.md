# YTDown — YouTube Downloader Website

Website YouTube Downloader dengan backend Express.js, support multi-server fallback.

## 📁 Struktur Project

```
ytdl/
├── api/
│   └── downloader.js     ← Logic download (4 server fallback)
├── public/
│   └── index.html        ← Frontend UI
├── server.js             ← Express server + API routes
├── vercel.json           ← Konfigurasi deploy Vercel
├── package.json
└── README.md
```

## 🚀 Cara Jalankan di VPS

### 1. Install dependensi
```bash
npm install
```

### 2. Jalankan server
```bash
# Mode produksi
npm start

# Mode development (auto-reload)
npm run dev
```

Server berjalan di: `http://localhost:3000`

### 3. (Opsional) Gunakan PM2 agar tetap berjalan
```bash
npm install -g pm2
pm2 start server.js --name ytdown
pm2 save
pm2 startup
```

### 4. (Opsional) Nginx reverse proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ☁️ Deploy ke Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

Ikuti instruksi di terminal. Vercel akan mendeteksi `vercel.json` secara otomatis.

### 4. Deploy ke Production
```bash
vercel --prod
```

---

## 🔌 API Endpoints

### POST `/api/mp3`
Download audio MP3

**Request:**
```json
{ "url": "https://www.youtube.com/watch?v=xxxx" }
```

**Response:**
```json
{
  "success": true,
  "title": "Judul Video",
  "downloadUrl": "https://...",
  "thumbnail": "https://..."
}
```

### POST `/api/mp4`
Download video MP4

**Request:**
```json
{ 
  "url": "https://www.youtube.com/watch?v=xxxx",
  "quality": "720"
}
```

Quality options: `360`, `480`, `720`, `1080`

### GET `/api/health`
Health check endpoint

---

## ⚙️ Environment Variables

Tidak ada env variable wajib. Opsional:
- `PORT` — Port server (default: 3000)

---

## ⚠️ Catatan

- Hanya untuk penggunaan pribadi
- Hormati hak cipta konten
- Server fallback: ytconvert → lbserver → savenow → ssyoutube
