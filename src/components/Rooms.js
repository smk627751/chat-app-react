import { useState } from 'react'
import {BsMoon,BsSun,BsThreeDotsVertical,BsBoxArrowInRight, BsChatLeftTextFill} from 'react-icons/bs'
function Rooms({darkMode,setDarkmode,setChat,socket,user,setRoom,setCurrentroom,rooms}){
    const [menu,setMenu] = useState(false)
    const jsonObj = rooms.map(JSON.stringify)
    rooms = new Set(jsonObj)
    rooms = Array.from(rooms).map(JSON.parse)
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
                        <div onClick={() => setDarkmode(prev => (!prev))}>
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
                        }}>
                        <div className='img'>
                            <img src={room?.photoURL} alt="avatar"/>
                        </div>
                        <div className='details'>
                            <span style={{fontWeight:'500'}}>{room?.user}<>{room?.user === user?" (You)":''}</></span>
                            <span style={{fontSize:'0.85rem', opacity:"80%"}}>{room?.room}</span>
                        </div>
                        </div>
                })}
          </div>
        </>
    )
}

export default Rooms