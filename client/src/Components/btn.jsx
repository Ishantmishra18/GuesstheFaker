import React from 'react'

const btn = ({text , handle , main }) => {
  return (
    <div className='px-6 py-4 rounded-tr-2xl rounded-bl-2xl bg-pink-600 text-white border-4 border-white/20 hover:rounded-3xl duration-300 cursor-pointer' onClick={handle}>{text}</div>
  )
}

export default btn