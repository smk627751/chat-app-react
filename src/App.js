import {useEffect, useState} from 'react'
import io from 'socket.io-client'
import Home from './components/home'
import Login from './components/login'

const endpoint = "http://localhost:5000" // if we run th server in local host
// const endpoint = "https://chat-app-server-uagt.onrender.com"
const socket = io.connect(endpoint)

function App() {

  const [photoURL,setPhoto] = useState('')
  const [user,setUser] = useState('')
  const [from,setFrom] = useState('')
  const [room,setRoom] = useState('')
  const [rooms,setRooms] = useState([])
  const [activeUsers,setActive] = useState([])
  const [chat,setChat] = useState(false)
  const [darkMode,setDarkmode] = useState(false)

  useEffect(() => {
    socket.on("rooms",(Rooms) => {
      const keys = Object.keys(Rooms)
      const users = keys.map(key => {
        const value = Rooms[key]
        return value
      })
      setRooms(users)
    })
  },[rooms])

  useEffect(() => {
    let credentials = localStorage.getItem("credentials") || null
    let darkMode = localStorage.getItem("darkMode") || null

    if(credentials)
    {
      credentials = JSON.parse(credentials)
      // console.log(credentials)
      setPhoto(credentials.photoURL)
      setUser(credentials.user)
      setFrom(credentials.from)
      setChat(credentials.chat)
      if(user != "")
      {
        socket.emit("new-user",user,from,photoURL)
      }
    }

    if(darkMode)
    {
      darkMode = JSON.parse(darkMode)
      setDarkmode(darkMode)
    }
  },[user,from,chat])

  useEffect(() => {

    socket.on("user-joined",user => {
      // userJoinned(user)
      setActive((prev)=>([...prev,user]))
      // console.log(activeUsers)
    })

    socket.on("user-left",user => {
      const index = activeUsers.indexOf(user)
      setActive((prev)=>(prev.splice(index,1)))
      // console.log(activeUsers)
    })
  },[rooms])

  return (
    <>
      {chat ?
         <Home darkMode={darkMode} setDarkmode={setDarkmode} setChat={setChat} socket={socket} activeUsers={activeUsers} user={user} from={from} room={room} setRoom={setRoom} rooms={rooms}/>
        :<Login socket ={socket} setPhoto={setPhoto} setUser={setUser} setFrom={setFrom} setRoom={setRoom} setChat={setChat}/>}  
    </>
  );
}

export default App;
