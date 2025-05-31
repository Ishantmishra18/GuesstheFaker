import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { socket } from '../utils/socket'
import Btn from '../Components/btn'

const Lobby = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { roomId } = useParams()
  const [isLoading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [players, setPlayers] = useState([])
  const [gameSettings, setGameSettings] = useState({
    rounds: 8,
    writingTime: 30,
    guessingTime: 30,
    maxPlayers: 8,
    customWords: []
  })

  useEffect(() => {
    let nickname = state?.nickname
    let avatar = state?.avatar
    let isCreator = state?.isCreator

    // Fallback to localStorage
    if (!nickname || !avatar) {
      nickname = localStorage.getItem('nickname')
      avatar = localStorage.getItem('avatar')
      isCreator = localStorage.getItem('isCreator') === 'true'
    } else {
      localStorage.setItem('nickname', nickname)
      localStorage.setItem('avatar', avatar)
      localStorage.setItem('isCreator', isCreator)
    }

    // Invalid state fallback
    if (!nickname || !avatar || !roomId) {
      alert('Missing player or room info')
      return navigate('/')
    }

    // Join room via socket
    socket.emit('join-room', { roomId, nickname, avatar, isCreator }, (response) => {
      if (response?.error) {
        alert(response.error)
        return navigate('/')
      }
    })

    const handleRoomPlayers = (data) => {
      setPlayers(data)
    }

    socket.on('room-players', handleRoomPlayers)

    return () => {
      socket.off('room-players', handleRoomPlayers)
    }
  }, [state, roomId, navigate])

  useEffect(() => {
    const handleGameStarted = () => {
      navigate(`/game/${roomId}`, {
        state: { players }
      })
    }

    socket.on('game-started', handleGameStarted)

    return () => {
      socket.off('game-started', handleGameStarted)
    }
  }, [roomId, navigate, players])

  const handleStartGame = () => {
    setLoading(true)
    socket.emit('start-game', { 
      roomId, 
      rounds: gameSettings.rounds,
      writingTime: gameSettings.writingTime,
      guessingTime: gameSettings.guessingTime
    }, (response) => {
      setLoading(false)
      if (response?.error) {
        alert(response.error)
      }
    })
  }

  const handleSettingChange = (setting, value) => {
    setGameSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const isCreator = localStorage.getItem('isCreator') === 'true'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-500/10 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Left Column - Room Info */}
        <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Game Lobby
                </h1>
                <div className="flex items-center gap-2 mt-3">
                  <p className="font-mono bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600/50">
                    {roomId}
                  </p>
                    <button
                    onClick={copyRoomId}
                    className="font-mono bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600/50 cursor-pointer transition flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <span className='text-green-600'>✓</span> Copied!
                      </>
                    ) : (
                      <>
                        <span>⎘</span> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm border border-green-500/20">
                {players.length} {players.length === 1 ? 'Player' : 'Players'}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4 text-gray-300">Connected Players</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {players.map((player, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-2 rounded-full transition-all duration-300 ${
                      player.creator
                        ? 'bg-purple-500/10 border border-purple-500/30 shadow-lg shadow-purple-500/10' 
                        : 'bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/30'
                    }`}
                  >
                    <div className="text-3xl bg-black/30 p-3 rounded-full border border-white/10">
                      {player.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-gray-100">{player.nickname}</p>
                      <p className="text-xs text-gray-400 mt-1">Joined</p>
                    </div>
                    {player.creator && (
                      <div className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold border border-yellow-400/20">
                        Host
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isCreator?(
              <div className="mt-6 md:w-[20vw]">

                <Btn
                  text={`Start Game (${players.length}/${gameSettings.maxPlayers})`}
                  handle={handleStartGame}
                  disabled={isLoading || players.length < 2}
                  dull={players.length < 3}
                  loading={isLoading}
                  loadingText="Starting Game..."
                  className={`w-full py-4 text-lg font-bold ${
                    players.length < 3 ? 'bg-gray-600/50' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  }`}
                />

                {players.length < 3 && (
                  <p className="text-center text-gray-400 text-sm mt-2">
                    Need at least 3 players to start
                  </p>
                )}
              </div>
            ):
            (
             <div className="text-center text-gray-400 text-sm mt-6">waiting for host to start the game...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lobby