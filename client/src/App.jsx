import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/home'
import Game from './Pages/game'
import NotFound from './Pages/404'
import Lobby from './Pages/lobby'

const App = () => {
  return (
    <Router>
      <Routes>  
        <Route path="/" element={<Home />} />
        <Route path="/lobby/:roomId" element={<Lobby />} />
        <Route path="/game/:roomId" element={<Game />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
