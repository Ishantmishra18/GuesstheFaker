import React, { useEffect, useState } from 'react'
import { useLocation, useParams , Link } from 'react-router-dom'
import { socket } from '../utils/socket'

const GameRoom = () => {

  const { state } = useLocation();

  const [players , setPlayers] =useState(3)


  const { roomId } = useParams()


  const [phase, setPhase] = useState('writing') // 'writing' | 'reveal' | 'results' | 'waiting'
  const [round, setRound] = useState(0)
  const [question, setQuestion] = useState('')
  const [subPlayer , setSubPlayer]= useState([])
  const [ansDis , setAnsDis] = useState(false);
  const [answer, setAnswer] = useState('')
  const [realQuestion , setRealQuestion]= useState('')
  const [allPlayers , setAllPlayers] = useState([])
  const [selectedVote, setSelectedVote] = useState([])


  const [allAnswers, setAllAnswers] = useState([]) // {userId, name, text}
  const [imposters, setImposters] = useState([])
  const [voteCounts, setVoteCounts] = useState({})
  const [hasVoted, setHasVoted] = useState(false)


  useEffect(()=>{

    socket.emit('start-round' , { roomId } , (response)=>{
      if(response.error) return alert(response.error)
    })

    socket.on('round-started', ({question})=>{
      setQuestion(question)
    })
  } , [round])


  useEffect(()=>{
    if(phase=='reveal'){
      socket.emit('get-answers',{roomId});
      socket.on('get-answers',({answers , question})=>{
        setAllAnswers(answers)
        setRealQuestion(question)
      })
    }
    else if(phase=='result'){
      setAllAnswers([])
    }
    
  },[phase])



    const submitAnswer = (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError('Please write your answer before submitting');
      return;
    }

    socket.emit('submit-answer', { 
      roomId, 
      userId: socket.id, 
      text: answer 
    }, (response) => {
      if (response.error) {
        alert(response.error)
      } else {
        setAnswer(''); // Clear input on success
      }
    });
  };


   useEffect(() => {
    const handleAnswerSubmitted = ({ userId, nickname, avatar }) => {
      setSubPlayer(prev => {
        if (!prev.some(player => player.userId === userId)) {
          return [...prev, { userId, nickname, avatar }];
        }
        return prev;
      });
    };

    socket.on('answer-submitted', handleAnswerSubmitted);

    if(subPlayer.length == 3){
      
      setTimeout(() => {
        setPhase('reveal')
        setSubPlayer([]);
      }, 2000);
    }

    return () => {
      socket.off('answer-submitted', handleAnswerSubmitted);
    };
  }, [socket , subPlayer]);








  // Submit vote for imposter
  const submitVote = (votedUserId) => {
    if (hasVoted) return
    socket.emit('submit-vote', { roomId, userId: socket.id, votedUserId })
    setHasVoted(true)
    setSelectedVote(null)
    socket.on('submit-vote' , ({answers})=>{
      setAllAnswers(answers)
    })
  }



  return (
    <div className="min-h-screen page3 text-white flex flex-col relative items-center justify-center p-6">
      <Link to='/' className="leave absolute top-4 left-4 px-6 py-3 bg-red-500 text-white rounded-2xl">leave game</Link>
      <div className="flex absolute top-4 right-4 gap-3">
      {subPlayer.map((p , k)=>(
        <div className="text-4xl p-3 rounded-full bg-black text-white" key={k}>{p.avatar}</div>
      ))}</div>
      
  <div className="text-center space-y-6">
  
  <div className="flex justify-center gap-8">
    <div className="bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/30">
      <h2 className="text-lg text-blue-300">Round</h2>
      <p className="text-2xl font-bold text-white">{round}</p>
    </div>
    
    <div className={`px-4 py-2 rounded-lg border ${
      phase === 'writing' 
        ? 'bg-green-500/10 border-green-500/30' 
        : 'bg-yellow-500/10 border-yellow-500/30'
    }`}>
      <h2 className="text-lg text-white">Phase</h2>
      <p className="text-2xl font-bold uppercase">
        {phase === 'writing' ? '✍️ Writing' : '🔍 Guessing'}
      </p>
    </div>
  </div>





  {phase === 'writing' && (
    <div className="max-w-md mx-auto bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
      <h3 className="text-xl font-medium mb-4 text-white">
        "{question}"
      </h3>
      
      <textarea
        rows={5}
        className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600/50 
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
        placeholder="Type your creative answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      
      <button
        onClick={submitAnswer}
        disabled={!answer.trim() || ansDis}
        className={`mt-4 px-6 py-3 rounded-lg font-bold transition w-full
          ${(!answer.trim() || ansDis) 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'}`}
      >
        {ansDis ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">↻</span> Submitting...
          </span>
        ) : (
          'Submit Answer'
        )}
      </button>
    </div>
  )}
</div>







     {phase === 'reveal' && (
  <>
    <h3 className="text-2xl mb-4">The question was</h3>
    <p className="mb-6 text-lg font-semibold">{realQuestion}</p>
    <h3 className="text-xl mb-2">All Answers (Click to vote who is Imposter):</h3>
    <div className="grid gap-3 max-w-xl w-full">
      {allAnswers?.map((ans, key) => (
        <div 
          key={key}
          onClick={() => setSelectedVote(ans.user.id)}
          className={`flex items-center p-4 rounded-lg cursor-pointer transition-all relative ${
            selectedVote === ans.user.id 
              ? 'bg-purple-600/50 border-2 border-purple-400' 
              : 'bg-blue-200/20 hover:bg-blue-200/30'
          }`}
        >
          <div className="absolute flex gap-2 bottom-1 right-1">
            {ans.votes.map((p , k)=>(
              <div className="text-lg">{p.avatar}</div>
            ))}
          </div>
          <div className="text-2xl mr-3">{ans.user.avatar}</div>
          <div className="text-lg">{ans.text}</div>
        </div>
      ))}
    </div>
    
    <button
      onClick={() => {
        if (selectedVote) {
          submitVote(selectedVote);
        } else {
          alert('Please select an answer to vote for');
        }
      }}
      disabled={hasVoted || !selectedVote}
      className={`mt-6 px-8 py-3 rounded-xl font-bold text-lg ${
        hasVoted || !selectedVote
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      {hasVoted ? 'Vote Submitted!' : 'Submit Vote'}
    </button>
    
    {hasVoted && (
      <p className="mt-4 text-green-400">
        You voted for: {
          allAnswers?.find(a => a.user.userId === selectedVote)?.user.nickname || 'Unknown'
        }
      </p>
    )}
  </>
)}






      {phase === 'results' && (
        <>
          <h3 className="text-2xl mb-4">Round Results:</h3>
          <div className="max-w-xl w-full">
            {Object.entries(voteCounts).map(([userId, count]) => {
              const player = allAnswers.find(a => a.userId === userId)
              return (
                <p key={userId}>
                  <strong>{player?.name || 'Unknown'}</strong>: {count} vote(s)
                </p>
              )
            })}
          </div>
          <h4 className="mt-4 text-lg">
            {imposters.length > 0
              ? `Imposter${imposters.length > 1 ? 's' : ''}: ${imposters
                  .map(id => {
                    const p = allAnswers.find(a => a.userId === id)
                    return p ? p.name : id
                  })
                  .join(', ')}`
              : 'No imposters voted.'}
          </h4>
          <p className="mt-6 italic">Next round will start shortly...</p>
        </>
      )}

      {phase === 'waiting' && <p>Waiting for other players...</p>}

      {phase === 'ended' && (
        <p className="text-xl font-bold mt-8">Game Over. Thanks for playing!</p>
      )}
    </div>
  )
}

export default GameRoom
