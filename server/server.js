const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const registerSocketHandlers = require('./sockets')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`)
  registerSocketHandlers(io, socket)
})

app.get('/', (req, res) => {
  res.send('Server is running 🎉')
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
