import { useEffect, useState } from "react";
import Rooms from "./Rooms";
import Chat from "./Chat";

function Home({peer,peerId,darkMode,setDarkmode,setChat,socket,activeUsers,photoURL,user,from,room,setRoom,rooms}){
    const [currentRoom,setCurrentroom] = useState('')
    const [storeNotification,setStore] = useState(true);
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
                <Rooms storeNotification={storeNotification} 
                setStore ={setStore} 
                darkMode ={darkMode} 
                setDarkmode={setDarkmode} 
                setChat={setChat} socket={socket} 
                activeUsers={activeUsers} 
                user={user} setRoom={setRoom} 
                setCurrentroom={setCurrentroom} 
                rooms={rooms}/>

                <Chat setStore ={setStore} 
                peer={peer}
                peerId={peerId}
                socket={socket}
                photoURL={photoURL} 
                user={user} 
                from={from} 
                room={room} 
                currentRoom={currentRoom} 
                setCurrentroom={setCurrentroom} 
                chats={chats}/>
                <section></section>
            </div>
        </>
    )
}

export default Home