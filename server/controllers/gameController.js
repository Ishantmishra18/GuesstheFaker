const { getRandomQuestionPair } = require('../utils/questions');
const { getRoom, getQuestions , selectRandomFaker ,  submitAnswer, getAllAnswers , getQuestion , updateVote} = require('./roomStore');

module.exports = (io, socket) => {
  socket.on('start-game', ({ roomId, rounds = 3, writingTimer = 60 }, callback) => {
    const state = getRoom(roomId);
    if (!state) return callback({ error: 'Room does not exist.' });

    if(state.players.length < 3) return callback({error:'you need atleast 3 players to start the game'})

    io.to(roomId).emit('game-started')
  });



  socket.on('start-round' , ({roomId} , callback)=>{
    const state = getRoom(roomId);

    let impSoc
    let questionPair


    if (!state) return callback({ error: 'Room does not exist.' });

    if(state.isRoundActive != true){

      state.isRoundActive = true;

    impSoc = selectRandomFaker(roomId)
    questionPair = getQuestions(roomId)

    } 
    else{
      impSoc = state.faker.id
      questionPair = state.questionPair
    }
         io.to(roomId).except(impSoc).emit('round-started' , {question: questionPair.real})
    socket.to(impSoc).emit('round-started' , {question: questionPair.fake})
  })



  // Player submits an answer

 // Update your socket handler
socket.on('submit-answer', ({ roomId, userId, text }, callback) => {
  try {
    const user = submitAnswer(roomId, userId, text);
    if (!user) throw new Error("Failed to submit answer");
    
    // Emit to all including the sender
    io.to(roomId).emit('answer-submitted', {
      userId: user.id,
      nickname: user.nickname,
      avatar: user.avatar
    });
    
    callback({ success: true });
  } catch (error) {
    callback({ error: error.message });
  }
});




socket.on('get-answers' , ({roomId})=>{
  const answers = getAllAnswers(roomId);
  const question = getQuestion(roomId);
  socket.emit('get-answers' , ({answers , question}))
})



socket.on('submit-vote' , ({roomId , userId , votedUserId})=>{
  const answer = updateVote(roomId , userId , votedUserId);
  io.to(roomId).emit('submit-vote' , {answer})
})





// Keep your existing submitAnswer function exactly as is
  

  

    // Store questionPair & phase
   

    // Reveal real question + all answers with player names
    
    // Tally votes for who was voted most as imposter
   
    

    // Prepare next round or end game
   
      // Reset answers and votes for next round
}