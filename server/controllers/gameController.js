
const { getRoom, getQuestions , selectRandomFaker ,  submitAnswer, getAllAnswers , getQuestion , updateVote , getImpAns , resetRoom} = require('./roomStore');

module.exports = (io, socket) => {
  socket.on('start-game', ({ roomId }, callback) => {
    const state = getRoom(roomId);
    if (!state) return callback({ error: 'Room does not exist.' });

    if(state.players.length < 3) return callback({error:'you need atleast 3 players to start the game'})

    io.to(roomId).emit('game-started')
  });



  socket.on('get-data' , ({roomId , userId})=>{
    
  })

  socket.on('start-round' , ({roomId} , callback)=>{
    const state = getRoom(roomId);


    if (!state) return callback({ error: 'Room does not exist.' });

    let impSoc = state.faker?.id
    let questionPair = state.questionPair

    if(state.isRoundActive != true){

      state.isRoundActive = true;

    impSoc = selectRandomFaker(roomId)
    questionPair = getQuestions(roomId)

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



socket.on('get-impQues' , ({roomId})=>{
  const state= getRoom(roomId)
  state.currentPhase='reveal'
  const imp = state.faker
  const question = state.questionPair.fake
  const answer = getImpAns(roomId , imp)

  socket.emit('get-impQues' , ({imp , question , answer}))
} )




socket.on('next-round' , ({roomId , userId})=>{
  const state = getRoom(roomId)
  state.getPhase = 'writing'

  const player = state.players.find(p=> p.id == userId)
  console.log(player)
  io.to(roomId).emit('next-round' , {player});
})


socket.on('reset' , ({roomId})=>{
  resetRoom(roomId)
})




// Keep your existing submitAnswer function exactly as is
  

  

    // Store questionPair & phase
   

    // Reveal real question + all answers with player names
    
    // Tally votes for who was voted most as imposter
   
    

    // Prepare next round or end game
   
      // Reset answers and votes for next round
}