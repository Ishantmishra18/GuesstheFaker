import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatars from '../utils/avatars'
import { socket } from '../utils/socket'
import Btn from '../Components/btn'
import { HiQuestionMarkCircle } from "react-icons/hi";
import HowToPlay from '../Components/howToPlay'

const Home = () => {
  const [nickname, setNickname] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const navigate = useNavigate()
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [cardShake, setCardShake] = useState(false)
  const [roomInputShake, setRoomInputShake] = useState(false)

  const validateInputs = () => {
    if (!nickname || !selectedAvatar) {
      setError('You need to pick nickname and avatar before starting the round')
      setCardShake(true)
      setTimeout(() => setCardShake(false), 500)
      return false
    }
    return true
  }

  const handleCreate = () => {
    if (!validateInputs()) return
    socket.emit('create-room', { nickname, avatar: selectedAvatar }, (response) => {
      if (response?.error) {
        setError(response.error)
        setCardShake(true)
        setTimeout(() => setCardShake(false), 500)
        return
      }
      const roomId = response.roomId
      navigate(`/lobby/${roomId}`, {
        state: { nickname, avatar: selectedAvatar, isCreator: true }
      })
    })
  }

  const handleJoin = () => {
    if (!validateInputs()) return
    if (roomCode.length !== 5) {
      setError('Room code must be 5 characters')
      setRoomInputShake(true)
      setTimeout(() => setRoomInputShake(false), 500)
      return
    }

    socket.emit('join-room', { 
      roomId: roomCode, 
      nickname, 
      avatar: selectedAvatar, 
      isCreator: false 
    }, (response) => {
      if (response?.error) { 
        setError(response.error)
        setRoomInputShake(true)
        setTimeout(() => setRoomInputShake(false), 500)
        return
      }
      navigate(`/lobby/${roomCode}`, {
        state: { nickname, avatar: selectedAvatar, isCreator: false }
      })
    })
  }



  const openAvatarModal = () => {
    setShowAvatarModal(true)
  }

  const closeAvatarModal = () => {
    setShowAvatarModal(false)
  }

  return (
    <div className="h-screen w-screen md:overflow-hidden bg-black text-white flex flex-col items-center justify-center p-4 md:p-6 relative">

      <div className="topbar absolute top-2 left-2 flex gap-3">
        <div className="howtoplay flex bg-black/20 z-30 rounded-full px-5 py-2 gap-3 items-center border-white/30 border-2 cursor-pointer hover:rotate-3 duration-200" onClick={()=>setShowHowToPlay(true)}>
            <HiQuestionMarkCircle className='text-xl'/>
            <h2 className=''>how to play</h2>
        </div>

      </div>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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

      {/* Main content container */}
      <div className="w-full h-full flex flex-col items-center justify-center relative z-10 overflow-hidden py-4">
        {/* Title section */}
        <div className="text-center mb-4 md:mb-8 w-full px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Guess the Faker
          </h1>
          <p className="text-sm md:text-lg text-blue-300/80 tracking-wider">A game of deception and deduction</p>
        </div>  

        {/* Card container */}
        <div className={`w-full max-w-4xl bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-8 flex flex-col lg:flex-row justify-between gap-4 md:gap-8 relative z-10 border border-white/10 shadow-2xl mb-4 ${cardShake ? 'animate-shake' : ''}`}>
          {/* ID Card Section */}
          <div className="relative bg-gradient-to-br border-2 py-8 md:py-12 border-white/30 from-purple-600/90 to-blue-500/90 rounded-3xl p-4 md:p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500 flex-1 mb-6 lg:mb-0">
            <div className="flex flex-col items-center gap-4 md:gap-6">
              {/* Avatar with glow effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
                <button
                  onClick={openAvatarModal}
                  className="relative h-24 w-24 md:h-32 md:w-32 text-5xl md:text-7xl flex items-center justify-center rounded-full bg-white/10 border-4 border-yellow-300/80 hover:border-yellow-200 transition-all duration-300 shadow-lg hover:scale-105 backdrop-blur-sm"
                  aria-label="Change avatar"
                >
                  {selectedAvatar || '👤'}
                  <div className="absolute inset-0 rounded-full border-2 border-white/20 pointer-events-none"></div>
                </button>
              </div>
              
              <div className="text-center">
                <label className="block text-base md:text-lg font-bold text-yellow-300 mb-1 font-mono tracking-wider animate-pulse">
                  YOUR AVATAR
                </label>
                <p className="text-xs text-yellow-400/70 font-mono animate-bounce">Click to change</p>
              </div>
              
              <div className="w-full">
                <label htmlFor="nickname" className="block text-xs md:text-sm font-bold text-yellow-200 mb-2 font-mono">
                  AGENT NAME:
                </label>
                <div className="relative">
                  <input
                    id="nickname"
                    type="text"
                    placeholder="Enter codename..."
                    className="w-full px-4 py-2 md:px-5 md:py-3 rounded-xl bg-black/40 border-2 border-yellow-400/50 focus:border-yellow-300 focus:outline-none transition-all duration-300 font-mono placeholder-yellow-200/40 text-yellow-100 shadow-lg text-sm md:text-base"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={20}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400/70">
                    ✎
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Actions Section */}
          <div className="flex flex-col gap-4 md:gap-6 flex-1">
            {/* Room Code Input */}
            <div className="relative">
              <label htmlFor="roomCode" className="block text-xs md:text-sm font-bold text-yellow-300 mb-2 font-mono tracking-wider">
                ENTER ROOM CODE:
              </label>
              <div className="relative">
                <input
                  id="roomCode"
                  type="text"
                  placeholder="XXXXX"
                  className={`w-full px-4 py-2 md:px-5 md:py-3 rounded-2xl bg-black/40 border-2 border-yellow-400/50 focus:border-yellow-300 focus:outline-none transition-all duration-300 font-mono placeholder-yellow-400/40 text-yellow-100 shadow-lg tracking-widest text-center text-lg md:text-xl ${roomInputShake ? 'animate-shake border-red-500' : ''}`}
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={5}
                />
                <div className="absolute -bottom-5 right-0 text-xs text-yellow-400/70 font-mono">
                  {roomCode.length}/5
                </div>
              </div>
            </div>

            {/* Button Group */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-between mt-2 md:mt-4">
              {/* Create Room Button */}
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-purple-600 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <Btn
                  text={'CREATE ROOM'}
                  handle={handleCreate}
                  className="relative w-full py-3 md:py-4 bg-gradient-to-br from-purple-700/90 to-purple-900/90 border-2 border-purple-400/80 hover:border-purple-300 text-white font-mono font-bold tracking-wider shadow-lg hover:scale-[1.02] transition-transform text-sm md:text-base"
                />
              </div>

              {/* Join Room Button */}
              <div className="relative flex-1 group">
                <div className={`absolute inset-0 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity`}></div>
                <Btn
                  text={'JOIN ROOM'}
                  handle={handleJoin}
                  style={false}
                  dull={roomCode.length !== 5}
                  disabled={roomCode.length !== 5}
                  className={`relative w-full py-3 md:py-4 border-2 font-mono font-bold tracking-wider shadow-lg transition-transform text-sm md:text-base`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="max-w-md text-center text-blue-300/70 text-xs md:text-sm mt-2 relative z-10 px-4">
          <p>Create a room or join with a 5-digit code. Can you spot the faker?</p>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-hidden">
          <div className="bg-gray-900/95 rounded-2xl p-4 md:p-6 w-full max-w-md mx-4 border border-white/10 shadow-2xl animate-fadeIn overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              <h2 className="text-xl font-bold text-white">Select an Avatar</h2>
              <button 
                onClick={closeAvatarModal}
                className="text-2xl hover:text-red-400 transition-colors"
                aria-label="Close avatar selection"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-5 md:grid-cols-6 gap-2 md:gap-3 max-h-[60vh] overflow-y-auto p-1 md:p-2">
              {avatars.map((avatar, index) => (
                <button
                  key={index}
                  className={`text-2xl md:text-3xl p-1 md:p-2 rounded-full transition-all duration-200 flex items-center justify-center hover:scale-110 ${
                    selectedAvatar === avatar
                      ? 'bg-blue-500/90 scale-110 shadow-lg shadow-blue-500/30'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  onClick={() => {
                    setSelectedAvatar(avatar)
                    closeAvatarModal()
                  }}
                  aria-label={`Select avatar ${avatar}`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


      {showHowToPlay && (
        <div className="w-screen h-screen bg-black/20 backdrop-blur-3xl fixed top-0 left-0 grid place-content-center z-40">
          <HowToPlay close={setShowHowToPlay}/>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-xs md:text-sm font-medium shadow-lg animate-bounceIn z-50 max-w-[90%]">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-3 text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default Home