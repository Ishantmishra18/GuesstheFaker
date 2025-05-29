import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import avatars from '../utils/avatars'
import { socket } from '../utils/socket'
import Btn from '../Components/btn'



const Home = () => {
  const [nickname, setNickname] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [roomCode, setRoomCode] = useState('')
  const navigate = useNavigate()
  const [error , setError] = useState('')

  const validateInputs = () => {
    if (!nickname || !selectedAvatar) {
      alert('Please enter a nickname and choose an avatar.')
      return false
    }
    return true
}

  const handleCreate = () => {
    if (!validateInputs()) return

    socket.emit('create-room', { nickname, avatar: selectedAvatar }, (response) => {
  if (response?.error) {setError(response.error)}
  const roomId = response.roomId
  navigate(`/lobby/${roomId}`, {
    state: { nickname, avatar: selectedAvatar, isCreator: true }
  })
})

  }

  const handleJoin = () => {
    if (!validateInputs()) return
    if (!roomCode) return alert('Enter a valid room code')


   socket.emit('join-room', { roomId:roomCode, nickname, avatar: selectedAvatar ,isCreator:false }, (response) => {
  if (response?.error){setError(response.error)} 
  navigate(`/lobby/${roomCode}`, {
    state: { nickname, avatar: selectedAvatar, isCreator: false }
  })
})

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-800 text-white flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-2">Guess the Faker</h1>
        <p className="text-lg text-blue-200">A game of deception and deduction</p>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-8 flex flex-col gap-6">
        {/* Nickname Input */}
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium mb-1">
            Nickname
          </label>
          <input
            id="nickname"
            type="text"
            placeholder="Enter your nickname"
            className="w-full px-4 py-3 rounded-xl bg-white/20 focus:bg-white/30 focus:outline-none transition duration-200"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
          />
        </div>

        {/* Avatar Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Choose your avatar
          </label>
          <div className="grid grid-cols-6 gap-2">
            {avatars.map((avatar, index) => (
              <button
                key={index}
                className={`text-3xl p-2 rounded-full transition duration-200 flex items-center justify-center ${
                  selectedAvatar === avatar
                    ? 'bg-blue-400 transform scale-110'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                onClick={() => setSelectedAvatar(avatar)}
                aria-label={`Select avatar ${avatar}`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Room Code Input */}
        <div>
          <label htmlFor="roomCode" className="block text-sm font-medium mb-1">
            Room Code (to join)
          </label>
          <input
            id="roomCode"
            type="text"
            placeholder="Enter room code"
            className="w-full px-4 py-3 rounded-xl bg-white/20 focus:bg-white/30 focus:outline-none transition duration-200 uppercase"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/80 text-white px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-2">
          <Btn
            text={'Create New Room'}
            handle={handleCreate}
            className="bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-bold text-lg"
          />
          <Btn
            text={'Join Room'}
            handle={handleJoin}
            className={`py-3 rounded-xl font-bold text-lg ${
              !roomCode.trim()
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          />
        </div>
      </div>

      {/* Game Instructions */}
      <div className="max-w-md text-center text-blue-200 text-sm mt-4">
        <p>Create a room or join with a code. Can you spot the faker?</p>
      </div>
    </div>
  )
}

export default Home
