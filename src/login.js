

function Login({socket,setUser,setRoom,setChat,user,room}) {

  const login = (e) => {
    e.preventDefault()
    setChat((prev)=> {return !prev})
    socket.emit("new-user",user,room)
  }

  return (
          <form className='login' onSubmit={login}>
            <h3>Join Room</h3>
            <input type='text' className='textBox' placeholder='Enter your name' required onInput={(e)=>setUser(e.target.value)}/>
            <input type='text' className='textBox' placeholder='Enter Room id' required onInput={(e)=>setRoom(e.target.value)}/>
            <input type="submit" value="Start Chat" className='submitBtn'/>
          </form>
         );
}

export default Login;
