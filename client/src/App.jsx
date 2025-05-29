import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/home'
import Game from './Pages/game'
import Room from './Pages/room'
import NotFound from './Pages/404'
import Results from './Pages/result'
import Lobby from './Pages/lobby'

const App = () => {
  return (
    <Router>
      <Routes>  
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/lobby/:roomId" element={<Lobby />} />
        <Route path="/game/:roomId" element={<Game />} />
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
