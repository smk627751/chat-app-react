import {useState} from 'react'
import io from 'socket.io-client'
import Chat from './Chat'
import Login from './login'

// const endpoint = "http://localhost:5000" // if we run th server in local host
const endpoint = "https://chat-app-server-uagt.onrender.com"
const socket = io.connect(endpoint)

function App() {

  const [user,setUser] = useState('')
  const [room,setRoom] = useState('')
  const [chat,setChat] = useState(false)
 
  return (
    <>
      {chat ?
         <Chat socket={socket} user={user} room={room}/>
        :<Login socket ={socket} setUser={setUser} setRoom={setRoom} setChat={setChat} user={user} room={room}/>}
        <section></section>  
    </>
  );
}

export default App;
