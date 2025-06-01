const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const registerSocketHandlers = require('./sockets')
const {allRooms} = require('./controllers/roomStore')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: ['https://guessthefaker.onrender.com', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`)
  registerSocketHandlers(io, socket)
})

app.get('/', (req, res) => {
  res.send('Server is running 🎉')
})

console.log(allRooms())

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
