import { useEffect, useState } from "react";
import Rooms from "./Rooms";
import Chat from "./Chat";

function Home({darkMode,setDarkmode,setChat,socket,user,from,room,setRoom,rooms}){
    const [currentRoom,setCurrentroom] = useState('')
    const [chats,setChats] = useState([])
    useEffect(() => {
        socket.on("set-message",(chats) =>{
            setChats(chats)
            // console.log(chats)
          })
    },[socket])
    return(
        <>
            <div className={`home ${darkMode ?"dark" :""}`}>
                <Rooms setDarkmode={setDarkmode} setChat={setChat} socket={socket} user={user} setRoom={setRoom} setCurrentroom={setCurrentroom} rooms={rooms}/>
                <Chat socket={socket} user={user} from={from} room={room} currentRoom={currentRoom} setCurrentroom={setCurrentroom} chats={chats}/>
                <section></section>
            </div>
        </>
    )
}

export default Home