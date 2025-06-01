const { getRandomQuestionPair } = require("../utils/questions")

let rooms = {}

function createRoom(roomId, player) {
  rooms[roomId] = {
    players: [player],
    currentRound: 1,
    currentPhase: null,
    isRoundActive:false,
    faker: null,
    questionPair: null,
    answers:[]
  }
}

function joinRoom(roomId, player) {
  if (rooms[roomId]) {
    rooms[roomId].players.push(player)
  }
}

function getRoom(roomId) {
  return rooms[roomId]
}

function roomExists(roomId) {
  return !!rooms[roomId]
}

function updatePlayerSocketId(roomId, nickname, socketId) {
  const player = rooms[roomId]?.players.find(p => p.nickname === nickname)
  if (player) player.id = socketId
}

function removePlayerFromRooms(socketId) {
  for (const roomId in rooms) {
    const originalLength = rooms[roomId].players.length
    rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socketId)

    if (rooms[roomId].players.length !== originalLength) {
      return roomId
    }
  }
  return null
}

function isRoomEmpty(roomId) {
  return rooms[roomId]?.players.length === 0
}

function deleteRoom(roomId) {
  delete rooms[roomId]
}



function selectRandomFaker(roomId) {
  const room = rooms[roomId];
  if (!room || room.players.length === 0) return null;

  // Filter out any disconnected players (no socket ID)
  const activePlayers = room.players.filter(player => player.id);
  
  if (activePlayers.length === 0) return null;

  // Select random player
  const randomIndex = Math.floor(Math.random() * activePlayers.length);
  const faker = activePlayers[randomIndex];

  // Update room with faker
  rooms[roomId].faker = {
    id: faker.id,
    nickname: faker.nickname,
    avatar: faker.avatar
  };

  return faker.id;
}

const getQuestions = (roomId) => {
  if (!rooms[roomId]) {
    throw new Error("Room does not exist getquestion");
  }
  
  const question = getRandomQuestionPair();
  rooms[roomId].questionPair = question;
  rooms[roomId].answers = []; // Reset answers for new round
  return question;
};

const submitAnswer = (roomId, userId, text) => {
  const room = rooms[roomId];
  if (!room) {
    throw new Error("Room does not exist submitanswer");
  }
  if (!room.faker) {
    throw new Error("Faker not selected for this round");
  }
  if (!room.questionPair) {
    throw new Error("Questions not generated for this round");
  }

  const isReal = userId !== room.faker.id;
  const user =  room.players.find(player=>player.id==userId)
  const answer = { user, text, votes:[]};
  room.answers.push(answer);
  console.log(room.answers)
  return room.players.find(player => player.id === userId);

};



const getAllAnswers=(roomId)=>{
  rooms[roomId].currentPhase = 'show'
    return rooms[roomId].answers 
  
  }

const getQuestion=(roomId)=>{
  return rooms[roomId].questionPair.real
}

const updateVote=(roomId , userId , votedUserId) =>{
  const room = rooms[roomId]
  const user = room.players.find(player => player.id == userId)
  const answerToUpdate = room.answers.find(a => a.user.id == votedUserId);
  answerToUpdate.votes.push(user);
  return room.answers
}


const getImpAns=(roomId , imp)=>{
  const ans = rooms[roomId].answers.find(a => a.user.id == imp.id)
  return ans.text;
}


const resetRoom = (roomId) => {
  rooms[roomId] = {
    ...rooms[roomId], // Preserve other properties
    currentRound: 1,
    isRoundActive: false,
    faker: null,
    questionPair: null,
    answers: []
  }
}

const allRooms =()=>{
  return rooms
}

module.exports = {
  createRoom,
  joinRoom,
  getRoom,
  roomExists,
  updatePlayerSocketId,
  removePlayerFromRooms,
  isRoomEmpty,
  deleteRoom,
  selectRandomFaker,
  getQuestions,
  submitAnswer,
  getAllAnswers,
  getQuestion,
  updateVote,
  getImpAns,
  resetRoom,
  allRooms,
}
