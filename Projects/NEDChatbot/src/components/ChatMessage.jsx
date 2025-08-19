import React from 'react'
export const ChatMessage = ({ message }) => {
  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg ${message.isUser ? 'bg-[#e63946] text-white rounded-tr-none' : 'bg-[#e8e1d9] text-black rounded-tl-none'}`}
      >
        <p>{message.text}</p>
      </div>
    </div>
  )
}
