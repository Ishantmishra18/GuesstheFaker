import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { socket } from '../utils/socket'

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
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Column - Room Info */}
        <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Room</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono bg-gray-700/50 px-3 py-1 rounded-lg">
                    {roomId}
                  </p>
                  <button
                    onClick={copyRoomId}
                    className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-sm transition flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <span>✓</span> Copied
                      </>
                    ) : (
                      <>
                        <span>⎘</span> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm">
                {players.length} {players.length === 1 ? 'Player' : 'Players'}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Players</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {players.map((player, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl transition ${
                      player.isCreator
                        ? 'bg-purple-500/10 border border-purple-500/30' 
                        : 'bg-gray-700/50 hover:bg-gray-700/70'
                    }`}
                  >
                    <div className="text-3xl">{player.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{player.nickname}</p>
                    </div>
                    {player.isCreator && (
                      <div className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold">
                        Host
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isCreator && (
              <button
                onClick={handleStartGame}
                disabled={isLoading || players.length < 2}
                className={`mt-6 w-full py-3 rounded-xl font-bold transition ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : players.length < 2 
                      ? 'bg-gray-600/50 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">↻</span> Starting...
                  </span>
                ) : (
                  `Start Game (${players.length}/${gameSettings.maxPlayers})`
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Settings (Host only) */}
        {isCreator && (
          <div className="w-full lg:w-96 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <h2 className="text-2xl font-bold mb-6">Game Settings</h2>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">Rounds</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={gameSettings.rounds}
                  onChange={(e) => handleSettingChange('rounds', parseInt(e.target.value) || 1)}
                  className="w-full p-3 bg-gray-700/70 rounded-lg border border-gray-600/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Writing Time (seconds)</label>
                <input
                  type="number"
                  min="10"
                  max="180"
                  value={gameSettings.writingTime}
                  onChange={(e) => handleSettingChange('writingTime', parseInt(e.target.value) || 10)}
                  className="w-full p-3 bg-gray-700/70 rounded-lg border border-gray-600/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Guessing Time (seconds)</label>
                <input
                  type="number"
                  min="10"
                  max="180"
                  value={gameSettings.guessingTime}
                  onChange={(e) => handleSettingChange('guessingTime', parseInt(e.target.value) || 10)}
                  className="w-full p-3 bg-gray-700/70 rounded-lg border border-gray-600/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Max Players</label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={gameSettings.maxPlayers}
                  onChange={(e) => handleSettingChange('maxPlayers', parseInt(e.target.value) || 2)}
                  className="w-full p-3 bg-gray-700/70 rounded-lg border border-gray-600/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Custom Words</label>
                <textarea
                  value={gameSettings.customWords.join(', ')}
                  onChange={(e) => handleSettingChange('customWords', e.target.value.split(',').map(w => w.trim()))}
                  className="w-full p-3 bg-gray-700/70 rounded-lg border border-gray-600/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 outline-none transition h-32"
                  placeholder="e.g. apple, banana, mountain"
                />
                <p className="text-xs text-gray-400 mt-1">Separate words with commas</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
              <h3 className="font-bold mb-3 text-lg">Game Summary</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-400">Rounds:</span>
                  <span className="font-medium">{gameSettings.rounds}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Writing Time:</span>
                  <span className="font-medium">{gameSettings.writingTime}s</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Guessing Time:</span>
                  <span className="font-medium">{gameSettings.guessingTime}s</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Max Players:</span>
                  <span className="font-medium">{gameSettings.maxPlayers}</span>
                </li>
                {gameSettings.customWords.length > 0 && (
                  <li className="flex justify-between">
                    <span className="text-gray-400">Custom Words:</span>
                    <span className="font-medium">{gameSettings.customWords.length}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Lobby