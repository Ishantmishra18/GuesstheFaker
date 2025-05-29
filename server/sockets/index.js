const roomHandlers = require('../controllers/roomController')
const gameHandlers = require('../controllers/gameController')

module.exports = (io, socket) => {
  roomHandlers(io, socket)
  gameHandlers(io, socket)
}
