import {useState} from 'react'
import io from 'socket.io-client'
import Chat from './Chat'

// const endpoint = "http://localhost:5000" // if we run th server in local host
const endpoint = "https://chat-app-server-uagt.onrender.com"
const socket = io.connect(endpoint)

function App() {

  const [user,setUser] = useState('')
  const [room,setRoom] = useState('')
  const [chat,setChat] = useState(false)
  const login = (e) => {
    e.preventDefault()
    setChat((prev)=> {return !prev})
    socket.emit("new-user",user,room)
  }

  return (
    <>
      {chat ?
         <Chat socket={socket} user={user} room={room}/>
        :<>
          <form className='login' onSubmit={login}>
            <h3>Join Room</h3>
            <input type='text' className='textBox' placeholder='Enter your name' required onInput={(e)=>setUser(e.target.value)}/>
            <input type='text' className='textBox' placeholder='Enter Room id' required onInput={(e)=>setRoom(e.target.value)}/>
            <input type="submit" value="Start Chat" className='submitBtn'/>
          </form>
        </>}
        <section></section>  
    </>
  );
}

export default App;
