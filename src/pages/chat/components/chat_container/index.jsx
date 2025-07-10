import React from 'react'
import ChatHeader from './components/chat_header'
import MessageBar from './components/message_bar'
import MessageContainer from './components/message_container'

const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static mg:flex-1">
        <ChatHeader/>
        <MessageContainer/>
        <MessageBar/>
    </div>
  )
}

export default ChatContainer