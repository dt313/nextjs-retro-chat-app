<br />

<div align="center">
  <a href="https://github.com/dt313/nextjs-retro-chat-app.git">
    <img src="./preview/large-logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Retro Chat</h3>

  <p align="center">
    <strong>RetroChat </strong>is a modern real-time chat application with a retro-style UI. It supports messaging, file sharing, group chats, reactions, notifications, audio/video calling, and more — built using <strong>Node.js</strong>, <strong>Next.js</strong>, and <strong>WebSocket</strong>.
    <br />
    <br />
    <a href="https://retro-chat-app-0407.vercel.app">View Demo</a>
  </p>
</div>

---

## 🖼️ Screenshots

![Chat UI](./preview/chat.png)

## 🚀 Features

✅ Sign up / Sign in with Google & GitHub  
✅ Real-time messaging
✅ Private chats & group chats  
✅ Send images, files, audio, video and emojis  
✅ Reactions on messages  
✅ Real-time notifications  
✅ Friend requests, join/invite/kick from groups  
✅ Voice & video calls (WebRTC)  
✅ OTP verification during signup  
✅ Responsive UI for mobile & desktop

---

## 🧑‍💻 Tech Stack

### 🖥️ Frontend

- [Next.js](https://nextjs.org/)
- React 19
- Redux Toolkit
- Websocket
- WebRTC

### 🔧 Backend

- Node.js (Express)
- MongoDB (Mongoose)
- JWT Authentication
- Multer (file uploads)
- Websocket
- Nodemailer (for OTP and password reset)

---

## 📦 Getting Started

### ⚙️ 1. Clone the repository

#### Front end

```bash
git clone https://github.com/dt313/nextjs-retro-chat-app.git
cd nextjs-retro-chat-app
```

```bash
npm install
```

**ENV SAMPLE**

```bash
NEXT_PUBLIC_API_URL=https://api.domain:3333/api/v1
NEXT_PUBLIC_DOMAIN=domain
NEXT_PUBLIC_PORT=3000
NEXT_PUBLIC_URL=https://domain:3000
NEXT_PUBLIC_API_DOMAIN=domain
NEXT_PUBLIC_API_PORT=3333
NEXT_PUBLIC_WS=ws
```

**RUN**

```bash
npm run dev
```

**RUN ON SSL**

```bash
npm run dev -- --experimental-https
```

#### Back end

```bash
git clone https://github.com/dt313/nodejs-retro-chat-app.git
cd nodejs-retro-chat-app
```

```bash
npm install
```

**ENV SAMPLE**

```bash
PORT=3333
DOMAIN=https://domain:3333
API_BASE_PATH=/api/v1
CORS_ORIGIN=https://domain:3000

DATABASE_URL=mongodb://root:example@localhost:27017/test?authSource=admin


GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=/auth/oauth2/callback/google

GITHUB_CLIENT_ID=GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=GITHUB_CLIENT_SECRET
GITHUB_REDIRECT_URI=/auth/oauth2/callback/github

FACEBOOK_CLIENT_ID=FACEBOOK_CLIENT_ID
FACEBOOK_CLIENT_SECRET=FACEBOOK_CLIENT_SECRET
FACEBOOK_REDIRECT_URI=/auth/oauth2/callback/facebook

CLOUDINARY_CLOUD_NAME=CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=CLOUDINARY_API_SECRET

ACCESS_TOKEN_SECRET=ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET=REFRESH_TOKEN_SECRET
REFRESH_TOKEN_PATH=REFRESH_TOKEN_PATH
ACCESS_TOKEN_EXPIRES_IN=dd
REFRESH_TOKEN_EXPIRES_IN=dd

EMAIL_USER=EMAIL_USER
EMAIL_PASS=EMAIL_PASS
COOKIE_DOMAIN=COOKIE_DOMAIN
COOKIE_MAX_AGE=COOKIE_MAX_AGE
REDIS_URL=redis://localhost:6379


```

**RUN**

```bash
npm run dev
```

**RUN ON SSL**

- setting certificate
