import React, { useEffect, useState } from 'react'
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom'
import { socket } from '../utils/socket'
import Btn from '../Components/btn'
import { motion, AnimatePresence } from 'framer-motion'

const GameRoom = () => {

  const location = useLocation();
  const players = location.state?.players || [];
  const { roomId } = useParams()


  const [phase, setPhase] = useState('writing') // 'writing' | 'show' | 'reveal' | 'waiting'
  const [round, setRound] = useState(1)
  const [question, setQuestion] = useState('')
  const [subPlayer, setSubPlayer] = useState([])
  const [ansDis, setAnsDis] = useState(false)
  const [answer, setAnswer] = useState('')
  const [realQuestion, setRealQuestion] = useState('')
  const [allPlayers, setAllPlayers] = useState([])
  const [selectedVote, setSelectedVote] = useState(null)
  const [timesVote, setTimesVote] = useState(1)
  const [allAnswers, setAllAnswers] = useState([])
  const [imposters, setImposters] = useState({})
  const [impQeustion, setImpQuestion] = useState('')
  const [impAnswer, setImpAnswer] = useState('')
  const [hasVoted, setHasVoted] = useState(false)
  const [readyPlayers, setReadyPlayers] = useState([])
  const [transition, setTransition] = useState(false)




  // Floating background elements
  const floatingElements = [...Array(15)].map((_, i) => ({
    id: i,
    style: {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 10 + 5}px`,
      height: `${Math.random() * 10 + 5}px`,
      animationDuration: `${Math.random() * 20 + 10}s`,
      animationDelay: `${Math.random() * 5}s`
    }
  }))

  // Phase transition animation
  const transitionToPhase = (newPhase, delay = 2000) => {
    setTransition(true)
    setTimeout(() => {
      setPhase(newPhase)
      setTransition(false)
    }, delay)
  }



  useEffect(()=>{
    socket.emit('get-data' , {roomId , userId :socket.id})
    socket.on('get-data' , ({phase})=>{
      setPhase(phase)
    })
  }, [])



  useEffect(() => {
    socket.emit('start-round', { roomId }, (response) => {
      if (response.error) return alert(response.error)
    })

    socket.on('round-started', ({ question }) => {
      setQuestion(question)
    })

    return () => {
      socket.off('round-started')
    }
  }, [round])

  useEffect(() => {
    if (phase === 'show') {
      socket.emit('get-answers', { roomId })
      socket.on('get-answers', ({ answers, question }) => {
        setAllAnswers(answers)
        setRealQuestion(question)
      })
    } else if (phase === 'result') {
      setAllAnswers([])
    } else if (phase === 'reveal') {
      socket.emit('get-impQues', { roomId })
      socket.on('get-impQues', ({ imp, question, answer }) => {
        setImposters(imp)
        setImpQuestion(question)
        setImpAnswer(answer)
      })
    }

    return () => {
      socket.off('get-answers')
      socket.off('get-impQues')
    }
  }, [phase])





  const submitAnswer = (e) => {
    e.preventDefault()
    if (!answer.trim()) {
      alert('Please write your answer before submitting')
      return
    }

    setAnsDis(true)
    socket.emit('submit-answer', {
      roomId,
      userId: socket.id,
      text: answer
    }, (response) => {
      if (response.error) {
        alert(response.error)
      } else {
        setAnswer('')
      }
    })
  }

  useEffect(() => {
    const handleAnswerSubmitted = ({ userId, nickname, avatar }) => {
      setSubPlayer(prev => {
        if (!prev.some(player => player.userId === userId)) {
          return [...prev, { userId, nickname, avatar }]
        }
        return prev
      })
    }

    socket.on('answer-submitted', handleAnswerSubmitted)

    if (subPlayer.length === players?.length) {
      transitionToPhase('show')
      setSubPlayer([])
      setAnsDis(false)
      setAnswer('')
    }

    return () => {
      socket.off('answer-submitted', handleAnswerSubmitted)
    }
  }, [socket, subPlayer])

  const submitVote = (votedUserId) => {
    if (hasVoted) return
    socket.emit('submit-vote', { roomId, userId: socket.id, votedUserId })
    setHasVoted(true)
  }

  useEffect(() => {
    socket.on('submit-vote', ({ answer }) => {
      setAllAnswers(answer)
      setTimesVote(prev => prev + 1)
      if (timesVote === players?.length) {
        setAllAnswers([])
        transitionToPhase('reveal')
      }
    })

    return () => {
      socket.off('submit-vote')
    }
  }, [socket, allAnswers, timesVote])


  const nextRound = () => {
    socket.emit('next-round', { roomId, userId: socket.id })
  }

  useEffect(() => {
    const handleNextRound = ({ player }) => {
      setReadyPlayers(prev => {
        if (!prev.some(p => p.id === player.id)) {
          return [...prev, player]
        }
        return prev
      })
    }

    const resetRoom = () => {
      setAllAnswers([])
      setHasVoted(false)
      setSelectedVote(null)
      setTimesVote(1)
    }

    socket.on('next-round', handleNextRound)

    if (readyPlayers.length === players?.length) {
      resetRoom()
      socket.emit('reset', { roomId })
      transitionToPhase('writing')
      setRound(prev => prev + 1)
      setReadyPlayers([])
    }

    return () => {
      socket.off('next-round', handleNextRound)
    }
  }, [socket, readyPlayers])


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full bg-blue-500/10 animate-float"
            style={el.style}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex gap-3">
          {subPlayer.map((p, k) => (
            <motion.div
              key={k}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: k * 0.1 }}
              className="text-4xl p-3 rounded-full bg-black/50 text-white border-2 border-yellow-400/50"
            >
              {p.avatar}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Round indicator */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-block bg-purple-500/20 px-6 py-2 rounded-full border border-purple-400/30">
          <span className="font-mono text-yellow-400">Round {round}</span>
        </div>
      </div>

      {/* Transition overlay */}
      <AnimatePresence>
        {transition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="text-4xl font-bold bg-gradient-to-r p-5 from-purple-500 to-blue-500 bg-clip-text text-transparent"
            >
              {phase === 'show' && 'the Imposter was...'}
              {phase === 'reveal' && 'Starting new round...'}
              {phase === 'writing' && 'Revealing Answers...'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main game content */}
      <div className="max-w-3xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {phase === 'writing' && (
            <motion.div
              key="writing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="max-w-md mx-auto bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 shadow-xl"
              >
                <h3 className="text-2xl font-medium mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  "{question}"
                </h3>

                <textarea
                  rows={5}
                  className="w-full bg-gray-700/50 text-white p-4 rounded-xl border border-gray-600/50 
                            focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition text-lg"
                  placeholder="Type your creative answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />

                <Btn
                  text={ansDis ? 'Submited' : 'Submit Answer'}
                  handle={submitAnswer}
                  disabled={!answer.trim() || ansDis}
                  loading={ansDis}
                  dull={ansDis}
                  onClick={()=>setAnsDis(true)}
                  className={`mt-6 w-full py-4 text-lg ${
                    !answer.trim() || ansDis
                      ? 'bg-gray-600/50'
                      : 'bg-green-600/90 hover:bg-green-700/90'
                  }`}
                />
              </motion.div>
            </motion.div>
          )}



          {phase === 'show' && (
            <motion.div
              key="show"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 mb-6">
                <h3 className="text-xl text-gray-300 mb-2">The question was</h3>
                <p className="text-2xl font-semibold text-white mb-6">{realQuestion}</p>
                <h3 className="text-xl text-yellow-400 mb-4">Click to vote for the imposter:</h3>
              </div>

              <div className="grid gap-4 max-w-xl w-full mx-auto">
                {allAnswers?.map((ans, key) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: key * 0.1 }}
                    onClick={() => setSelectedVote(ans.user.id)}
                    className={`flex items-center p-5 rounded-2xl cursor-pointer transition-all relative border-2 ${
                      selectedVote === ans.user.id
                        ? 'bg-purple-600/30 border-purple-400 scale-105'
                        : 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-700/70'
                    }`}
                  >
                    <div className="text-3xl mr-4 bg-black/30 p-3 rounded-full border border-white/10">
                      {ans.user.avatar}
                    </div>
                    <div className="text-lg flex-1 text-left">{ans.text}</div>
                    <div className="absolute bottom-2 right-3 flex gap-1">
                      {ans.votes.map((p, k) => (
                        <div key={k} className="text-lg opacity-80">
                          {p.avatar}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <Btn
                text={hasVoted ? 'Vote Submitted!' : 'Submit Vote'}
                handle={() => {
                  if (selectedVote) {
                    submitVote(selectedVote)
                  } else {
                    alert('Please select an answer to vote for')
                  }
                }}
                disabled={hasVoted || !selectedVote}
                className={`mt-8 w-full max-w-xs mx-auto py-4 text-lg ${
                  hasVoted || !selectedVote
                    ? 'bg-gray-600/50'
                    : 'bg-green-600/90 hover:bg-green-700/90'
                }`}
              />

              {hasVoted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-green-400"
                >
                  You voted for: {allAnswers?.find(a => a.user.userId === selectedVote)?.user.nickname || 'Unknown'}
                </motion.p>
              )}
            </motion.div>
          )}

          {phase === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 shadow-xl"
              >
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6">
                  The Imposter Was...
                </h2>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl mb-4"
                >
                  {imposters.avatar}
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-8">{imposters.nickname}</h2>

                <div className="space-y-4 text-left max-w-md mx-auto">
                  <div className="bg-gray-700/50 p-4 rounded-xl">
                    <h3 className="text-sm text-gray-400 mb-1">Their secret question was:</h3>
                    <p className="text-lg">{impQeustion}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-xl mb-10">
                    <h3 className="text-sm text-gray-400 mb-1">Their answer was:</h3>
                    <p className="text-lg">{impAnswer}</p>
                  </div>
                </div>

                <Btn
                  text="Ready for Next Round"
                  handle={nextRound}
                  className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 text-lg rounded-xl"
                />

                <div className="mt-6 flex justify-center gap-2">
                  {readyPlayers?.map((p, k) => (
                    <motion.div
                      key={k}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: k * 0.1 }}
                      className="text-xl bg-black/30 p-2 rounded-full border border-yellow-400/30"
                    >
                      {p.avatar}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GameRoom