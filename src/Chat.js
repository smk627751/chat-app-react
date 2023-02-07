import {useEffect, useRef, useState} from 'react'

function Chat(props) {
  const socket = props.socket
  const input = useRef()
  const container = useRef()
  const file = useRef()
  const [User,setUser] = useState('')
  const [room,setRoom] = useState('')
  useEffect(()=>{
    setRoom(props.room)
    setUser(props.user)
    socket.on("receive-message",(data,user) =>{
      appendMessage(data,"received",user)
    })

    socket.on("user-joined",user => {
      userJoinned(user)
    })

    socket.on("user-left",user => {
      userLeft(user)
    })

  },[props,socket])

  const send = (e)=>{
    e.preventDefault()
    if(input.current.value !== '')
    {
      socket.emit("send-message",input.current.value,User,room)
      appendMessage(input.current.value,"sent","")
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
        socket.emit("send-message",new_url,User,room)
        appendMessage(new_url,"sent","")
        file.current.value = ''
      }
    }
  }
  const appendMessage = (data,className,user) => {
    const msg = document.createElement('p')
    if(data.includes('data:image'))
    {
      const image = document.createElement('img')
      image.src = data
      image.className = 'imgtag'
      msg.appendChild(image)
      const atag = document.createElement('a')
      atag.setAttribute('href',data)
      atag.target = '_blank'
      msg.appendChild(atag)
      image.onclick = () => atag.click()
    }
    else if(data.includes('http'))
    {
      const aTag = document.createElement('a')
      aTag.href = data
      aTag.target = '_blank'
      aTag.innerText = data
      aTag.className = 'atag'
      msg.appendChild(aTag)
    }
    else
    {
      msg.innerText = data
    }
    msg.className = "bubble"
    msg.classList.add(className)
    msg.setAttribute('data-user',user)
    let time = new Date()
    let f = new Intl.DateTimeFormat(('en-US'),{
      timeStyle:'short'
    })
    msg.setAttribute('data-time',f.format(time))
    container.current.append(msg)
    msg.scrollIntoView()
  }

  return (
    <>
        <header><span className='heading'>Chat Room</span></header>
        <div ref={container} className='container'></div>
        <form className='inputBox' onSubmit={send}>
          <input ref={input} className='textBox' placeholder='say hi👋..'/>
          <input ref={file} type='file'onChange={uploadfile} accept='.jpg'/>
          <svg viewBox="0 0 24 24" className='icon' onClick={open}>
            <path d="M3,22H21a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3V21A1,1,0,0,0,3,22Zm2.414-2L10,15.414l1.293,1.293a1,1,0,0,0,1.414,0L17,12.414l3,3V20ZM20,4v8.586l-2.293-2.293a1,1,0,0,0-1.414,0L12,14.586l-1.293-1.293a1,1,0,0,0-1.414,0L4,18.586V4ZM6,8.5A2.5,2.5,0,1,1,8.5,11,2.5,2.5,0,0,1,6,8.5Z"/>
          </svg>
          <input type="submit" value="Send" className='submitBtn'/>
        </form>
    </>
  );
}

export default Chat;
