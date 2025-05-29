// controllers/roomController.js

const { 
  createRoom, 
  joinRoom, 
  getRoom, 
  updatePlayerSocketId, 
  removePlayerFromRooms, 
  isRoomEmpty, 
  deleteRoom, 
  roomExists ,
} = require('./roomStore')

const { generateRoomCode } = require('../utils/helpers')

module.exports = (io, socket) => {
  socket.on('create-room', ({ nickname, avatar }, callback) => {
    let roomId
    do {
      roomId = generateRoomCode()
    } while (roomExists(roomId))

    const player = { id: socket.id, nickname, avatar, creator: true }
    createRoom(roomId, player)
    socket.join(roomId)

    io.to(roomId).emit('room-players', getRoom(roomId).players)
    callback({ roomId })
  })

  socket.on('join-room', ({ roomId, nickname, avatar, isCreator }, callback) => {
    if (!roomExists(roomId)) return callback({ error: 'Room not found.' })

    const room = getRoom(roomId)
    const existingIndex = room.players.findIndex(p => p.nickname === nickname)

    if (existingIndex !== -1) {
      updatePlayerSocketId(roomId, nickname, socket.id)
    } else {
      const player = { id: socket.id, nickname, avatar, creator: isCreator }
      joinRoom(roomId, player)
    }

    socket.join(roomId)
    io.to(roomId).emit('room-players', getRoom(roomId).players)
    return callback({ roomId })
  })

  socket.on('disconnect', () => {
    const roomId = removePlayerFromRooms(socket.id)

    if (roomId) {
      io.to(roomId).emit('room-players', getRoom(roomId).players)
      setTimeout(() => {
        if (isRoomEmpty(roomId)) {
          deleteRoom(roomId)
        }
      }, 5000)
    }
  })
}
