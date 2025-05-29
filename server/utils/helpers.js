const generateRoomCode = (length = 5) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const roomIsStillEmpty = (rooms, roomId) => {
  return rooms[roomId] && rooms[roomId].length === 0
}

const deleteRoom = (rooms, roomId) => {
  if (rooms[roomId]) {
    delete rooms[roomId]
    console.log(`🗑️ Room deleted: ${roomId}`)
  }
}

module.exports = { generateRoomCode, roomIsStillEmpty, deleteRoom }
