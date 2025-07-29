# 🎭 Guess The Faker - Real-time Multiplayer Social Deduction Game

![Socket.IO](https://img.shields.io/badge/Socket.IO-RealTime-blue)
![MERN Stack](https://img.shields.io/badge/MERN-FullStack-green)
![Live](https://img.shields.io/badge/Live-Online-brightgreen)

**Guess The Faker** is a fun, fast-paced online multiplayer game built using the **MERN stack** and **Socket.IO**. It challenges players to spot the *faker* among them through social deduction, quick thinking, and deception — all in real-time.

---

## 🚀 Live Demo

- 🔗 **Frontend**: [https://guessthefaker.onrender.com](https://guessthefaker.onrender.com)  
- 🔗 **Backend API**: [https://guessthefaker-backend.onrender.com](https://guessthefaker-backend.onrender.com)

---

## 🖼️ Screenshots

<div align="center">
  <img src="/ss/screen.png" alt="Desktop View" width="45%">
  <img src="https://guessthefaker.onrender.com/ss/mobile.jpg" alt="Mobile View" width="25%">
</div>

---

## 🕹️ How to Play

1. **Join a Room**: Minimum **3 players** are required to start a game.
2. **Answer Questions**: Everyone receives the same question except for one player — the *faker* — who gets a different one.
3. **Reveal & Guess**: After all players submit their answers, you must try to figure out who the faker is!
4. **Score Points**: Correctly guess the faker or trick others to earn points!

📋 Game instructions and rules are displayed on the homepage of the application.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Socket.IO Client
- **Backend**: Node.js, Express.js, Socket.IO Server
- **Database**: MongoDB Atlas
- **Hosting**: Render

---

## 📦 Installation (For Local Development)

### ⚙️ Prerequisites

- Node.js and npm installed
- MongoDB running locally or via Atlas
- Git installed

---

### 🔧 Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/Ishantmishra18/GuesstheFaker.git
cd GuesstheFaker

# 2. Run Backend
cd server
npm install
npx nodemon server.js

# (in a new terminal)
# 3. Run Frontend
cd client
npm install
npm run dev
