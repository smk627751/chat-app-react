import { useEffect, useState } from 'react'
import {BsMoon,BsSun,BsThreeDotsVertical,BsBoxArrowInRight, BsChatLeftTextFill} from 'react-icons/bs'
function Rooms({storeNotification,setStore,darkMode,setDarkmode,setChat,socket,activeUsers,user,setRoom,setCurrentroom,rooms}){
    const [menu,setMenu] = useState(false)
    const jsonObj = rooms.map(JSON.stringify)
    rooms = new Set(jsonObj)
    rooms = Array.from(rooms).map(JSON.parse)
    const [notifications,setNotify] = useState({})
    
    const notify = (data,user) => {
        if (!("Notification" in window)) {
          console.log("Browser does not support desktop notification");
        } 
        else if(Notification.permission === "granted")
        {
            const notification = new Notification(`${user} : ${data.message}`)
        }
        else if(Notification.permission === "denied"){
          Notification.requestPermission().then(permission => {
                if(permission === "granted")
                {
                    const notification = new Notification(`${user} : ${data.message}`)
                }
          })
        }
      }

    useEffect(() => {
        socket.on("notify-message",(data,user) => {
            if(storeNotification)
            {
                setNotify((prev) => ({...prev,[user]:data}))
            }
            notify(data,user)
        })
      },[socket])

    return (
        <>
            <div className='rooms'>
                <div className='chat-header'>
                    <div>
                        <BsChatLeftTextFill/> 
                    </div>
                    <span>Chats</span>
                    <div style={{marginLeft:"60%",cursor:"pointer"}} onClick={() => (setMenu(prev => (!prev)))}>
                        <BsThreeDotsVertical/>
                    </div>
                    {menu && <div className='menu'>
                        <div onClick={() => {
                            setDarkmode(prev => (!prev))
                            localStorage.setItem("darkMode",JSON.stringify(darkMode))
                            }}>
                            <label htmlFor='switch'>{darkMode?"Light Mode":"Dark Mode"}</label>
                            <span id='switch'>
                                {darkMode?<BsSun/>:<BsMoon/>}
                            </span>
                        </div>
                        <div>
                            <label htmlFor='logout'>Logout</label>
                            <span id='logout' onClick={() =>{
                                localStorage.removeItem("credentials")
                                setChat(false)
                            }}>
                                <BsBoxArrowInRight/>
                            </span>
                        </div>
                    </div>}
                </div>
                {rooms.length === 0 && <div className='loader'></div>}
                {rooms.map((room,index) => {
                    return <div className={`user ${room?.user === user ?"top":""}`} key={index} onClick={(e) => {
                        socket.emit("get-chat",room)
                        setRoom(room?.room)
                        setCurrentroom(room)
                        setStore((prev) => (!prev))
                        delete notifications[room?.user]
                        }}>
                        <div className='img'>
                            {activeUsers.includes(room?.user) && !(activeUsers.includes(user)) && <div className='active-status'/>}
                            <img src={room?.photoURL} alt="avatar"/>
                        </div>
                        <div className='details'>
                            <span style={{fontWeight:'500'}}>{room?.user}<>{room?.user === user?" (You)":''}</></span>
                           { !(Object.keys(notifications).includes(room?.user)) ? <span style={{fontSize:'0.85rem', opacity:"80%"}}>{room?.room}</span>
                            : <span style={{fontWeight:'bold',fontSize:'0.85rem', opacity:"80%"}}>{notifications[room?.user]?.message}</span>}
                        </div>
                        </div>
                })}
          </div>
        </>
    )
}

export default Rooms