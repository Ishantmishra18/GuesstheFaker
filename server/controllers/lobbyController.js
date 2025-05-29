const { 
  createRoom, 
  joinRoom, 
  getRoom, 
  updatePlayerSocketId, 
  removePlayerFromRooms, 
  isRoomEmpty, 
  deleteRoom, 
  roomExists 
} = require('./roomStore');



module.exports = (io, socket) => {
    socket.on('getInfo' , (roomId)=>{
        const room = getRoom(roomId)
        const players = room.players
        socket.emit('update-players' ,{players})
    })

}