import { useState } from 'react'
import {BsThreeDotsVertical,BsBoxArrowInRight, BsChatLeftTextFill} from 'react-icons/bs'
function Rooms({setDarkmode,socket,user,setRoom,setCurrentroom,rooms}){
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
                        <div>
                            <label htmlFor='checkBox'>Dark Mode</label>
                            <span>
                                <input type='checkbox' id="checkBox" className='checkbox' onChange={() => setDarkmode(prev => (!prev))}/>
                            </span>
                        </div>
                        <div>
                            <label htmlFor='logout'>Logout</label>
                            <span id='logout'><BsBoxArrowInRight/></span>
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
                            <span>{room?.user}<>{room?.user === user? "(You)":''}</></span>
                            <span>{room?.room}</span>
                        </div>
                        </div>
                })}
          </div>
        </>
    )
}

export default Rooms