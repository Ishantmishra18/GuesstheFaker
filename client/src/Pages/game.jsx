import React, { useEffect, useState } from 'react'
import { useLocation, useParams , Link } from 'react-router-dom'
import { socket } from '../utils/socket'

const GameRoom = () => {

  const { state } = useLocation();

  const [players , setPlayers] =useState(3)


  const { roomId } = useParams()


  const [phase, setPhase] = useState('writing') // 'writing' | 'show' | 'reveal' | 'waiting'
  const [round, setRound] = useState(0)
  const [question, setQuestion] = useState('')
  const [subPlayer , setSubPlayer]= useState([])
  const [ansDis , setAnsDis] = useState(false);
  const [answer, setAnswer] = useState('')
  const [realQuestion , setRealQuestion]= useState('')
  const [allPlayers , setAllPlayers] = useState([])
  const [selectedVote, setSelectedVote] = useState([])


  const [timesVote , setTimesVote]= useState(1);


  const [allAnswers, setAllAnswers] = useState([]) // {userId, name, text}
  const [imposters, setImposters] = useState({})
  const [impQeustion , setImpQuestion] = useState('')
  const [impAnswer , setImpAnswer] = useState('');

  const [voteCounts, setVoteCounts] = useState({})
  const [hasVoted, setHasVoted] = useState(false)

  const [readyPlayers , setReadyPlayers]= useState([])


  useEffect(()=>{

    socket.emit('start-round' , { roomId } , (response)=>{
      if(response.error) return alert(response.error)
    })

    socket.on('round-started', ({question})=>{
      setQuestion(question)
    })
  } , [round])


  useEffect(()=>{
    if(phase=='show'){
      socket.emit('get-answers',{roomId});
      socket.on('get-answers',({answers , question})=>{
        setAllAnswers(answers)
        setRealQuestion(question)
      })
    }
    else if(phase=='result'){
      setAllAnswers([])
    }

    else if(phase == 'reveal'){
      socket.emit('get-impQues', {roomId});
      socket.on('get-impQues' , ({imp , question , answer})=>{
        setImposters(imp);
        setImpQuestion(question)
        setImpAnswer(answer)
      })
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
        setPhase('show')
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
  }

  useEffect(()=>{
    socket.on('submit-vote' , ({answer})=>{
      console.log(answer)
      setAllAnswers(answer)
      setTimesVote(prev => prev+1)
      if(timesVote == 3){
        setAllAnswers([])
        setTimeout(() => {
          setPhase('reveal')
        }, 2000);
      }

    })

    return () => {
      socket.off('submit-vote');
    };

  },[socket , allAnswers])



  //next round
  const nextRound=()=>{
    socket.emit('next-round' , {roomId , userId:socket.id })

  }

  useEffect(() => {
  const handleNextRound = ({player}) => {
    setReadyPlayers(prev => {
      if (!prev.some(p => p.id === player.id)){
        return [...prev, player];
      }
      return prev;
    });
  };

  const resetRoom = ()=>{
    setAllAnswers([])
    
  }

  socket.on('next-round', handleNextRound);
  console.log(readyPlayers)
  if(readyPlayers.length == 3){
    resetRoom()
    socket.emit('restart' , {roomId})
    
    setTimeout(() => {
      setPhase('writing')
      setRound(prev => prev+1)
    }, 2000);
  }

  return () => {
    socket.off('next-round', handleNextRound);
  };
}, [socket,readyPlayers]);



  return (
    <div className="min-h-screen page3 text-white flex flex-col relative items-center justify-center p-6">
      <Link to='/' className="leave absolute top-4 left-4 px-6 py-3 bg-red-500 text-white rounded-2xl">leave game</Link>
      <div className="flex absolute top-4 right-4 gap-3">

      {subPlayer.map((p , k)=>(
        <div className="text-4xl p-3 rounded-full bg-black text-white" key={k}>{p.avatar}</div>
      ))}</div>
      
  <div className="text-center space-y-6">


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







     {phase === 'show' && (
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






      {phase === 'reveal' && (
        <>
          <div className="flex flex-col justify-center items-center">
            <h2>the imposter wasss...</h2>
            <h4>{imposters.avatar}</h4>
            <h2>{imposters.nickname}</h2>

            <h3>the his question was </h3>
            <h4>{impQeustion}</h4>
            <h2>his answer was</h2>
            <h2>{impAnswer}</h2>
            <h2 className='px-4 py-2 bg-amber-600 text-white' onClick={nextRound}>ready for next round</h2>
            <div className="flex gap-2">
              {readyPlayers?.map((p , k)=>(
                <div className="text-xl " key={k}>{p.avatar}</div>
              ))}

            </div>
          </div>
          
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
