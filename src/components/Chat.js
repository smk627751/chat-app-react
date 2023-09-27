import {useEffect, useRef, useState} from 'react'
import { BsChevronLeft,BsFillImageFill, BsFillSendFill } from "react-icons/bs"

function Chat({socket,user,from,room,currentRoom,setCurrentroom,chats}) {
  const input = useRef()
  const container = useRef()
  const file = useRef()

  const send = (e)=>{
    e.preventDefault()
    let timeStamp = new Date()
    if(input.current.value !== '')
    {
      socket.emit("send-message",{message:input.current.value,timeStamp},user,from,room)
      appendMessage({message:input.current.value,timeStamp},"sent","")
      input.current.value = ''
    }
  }

  const userJoinned = user =>{
    let toast = document.createElement('span')
    toast.innerText = `${user} joinned the chat`
    toast.className = "toast"
    if(container !== ''|| container !== '')
    container.current.append(toast)
    toast.scrollIntoView()
  }

  const userLeft = user =>{
    let toast = document.createElement('span')
    toast.innerText = `${user} Left the chat`
    toast.className = "toast"
    if(container !== ''|| container !== '')
    container.current.append(toast)
    toast.scrollIntoView()
  }
  const open = () =>{
    file.current.click()
  }
  const uploadfile = () =>{
    const image = file.current.files[0]
    const fileReader = new FileReader()
    fileReader.readAsDataURL(image)

    fileReader.onload = () => {
      const res = fileReader.result
      const img = document.createElement('img')
      img.src = res
      img.onload = () =>{
        let canvas = document.createElement('canvas')
        const width = 400
        let ratio = width / img.width
        canvas.width = width
        canvas.height = img.height * ratio

        const context = canvas.getContext('2d')
        context.drawImage(img,0,0,canvas.width,canvas.height)
        const new_url = context.canvas.toDataURL(img,"image/jpeg",80)
        let timeStamp = new Date()
        socket.emit("send-message",{message:new_url,timeStamp},user,from,room)
        appendMessage({message:new_url,timeStamp},"sent","")
        file.current.value = ''
      }
    }
  }
  const appendMessage = (data,className,user) => {
    const msg = document.createElement('p')
    if(data.message.includes('data:image'))
    {
      const image = document.createElement('img')
      image.src = data.message
      image.className = 'imgtag'
      msg.appendChild(image)
      const atag = document.createElement('a')
      atag.setAttribute('href',data.message)
      atag.target = '_blank'
      msg.appendChild(atag)
      image.onclick = () => atag.click()
    }
    else if(data.message.includes('http'))
    {
      const aTag = document.createElement('a')
      aTag.href = data.message
      aTag.target = '_blank'
      aTag.innerText = data
      aTag.className = 'atag'
      msg.appendChild(aTag)
    }
    else
    {
      msg.innerText = data.message
    }
    msg.className = "bubble"
    msg.classList.add(className)
    // msg.setAttribute('data-user',user)
    let time = Date.parse(data.timeStamp)
    let f = new Intl.DateTimeFormat(('en-US'),{
      timeStyle:'short'
    })
    msg.setAttribute('data-time',f.format(time))
    container.current.append(msg)
    msg.scrollIntoView()
  }

  useEffect(() => {
    container.current.innerHTML=""
    chats.map(chat => {
      if((from === chat.from && currentRoom.room === chat.room)||(from === chat.room && currentRoom.room === chat.from))
      {
        if(chat.user === user)
        {
          appendMessage(chat.data,"sent","")
        }
        else
        {
          appendMessage(chat.data,"received",chat.user)
        }
      }
    })

  },[chats])

  useEffect(()=>{

    socket.on("receive-message",(data,user) =>{
      appendMessage(data,"received",user)
    })

    socket.on("user-joined",user => {
      userJoinned(user)
    })

    socket.on("user-left",user => {
      userLeft(user)
    })

  },[socket])

  return (
    <>
      <div className={`chatPage ${currentRoom?'':"hide"}`}>
        <header>
          <div className='back' onClick={() => setCurrentroom('')}>
            <BsChevronLeft/>
          </div>
          <div className='img'>
                <img src={currentRoom?.photoURL} alt='avatar'/>
          </div>
          <div className='details'>
                <span>{currentRoom?.user}<>{currentRoom?.user === user? " (You)":''}</></span>
                <span>{currentRoom?.room}</span>
              </div>
        </header>
        <div ref={container} className='container'></div>
        <form className='inputBox' onSubmit={send}>
          <input ref={input} className='textBox' placeholder='say hi👋..'/>
          {/* <input ref={file} type='file'onChange={uploadfile} accept=".jpg, .png, .gif"/>
          <div className='icon'>
            <BsFillImageFill onClick={open}/>
          </div> */}
          <button className='submitBtn' style={{minWidth:'50px'}}><BsFillSendFill/></button>
        </form>
      </div>
    </>
  );
}

export default Chat;
