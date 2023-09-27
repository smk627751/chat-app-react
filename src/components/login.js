import { googleSignIn } from "./firebase"
import { IoLogoGoogle } from "react-icons/io"

function Login({socket,setPhoto,setUser,setFrom,setChat}) {

  const login = async (e) => {
    e.preventDefault()
    const {user} = await googleSignIn()
    // console.log(user)
    setUser(user.displayName)
    setFrom(user.email)
    setPhoto(user.photoURL)
    setChat((prev)=> {return !prev})
    localStorage.setItem("credentials",JSON.stringify({photoURL:user.photoURL,user:user.displayName,from:user.email,chat:true}))
    socket.emit("new-user",user.displayName,user.email,user.photoURL)
  }

  return (
          <form className='login' onSubmit={login}>
            {/* <h3>Join Room</h3> */}
            {/* <input type='text' className='textBox' placeholder='Enter your name' required onInput={(e)=>setUser(e.target.value)}/>
            <input type='text' className='textBox' placeholder='Enter Room id' required onInput={(e)=>setRoom(e.target.value)}/> */}
            <button className="submitBtn">
              <div>
                <IoLogoGoogle/>
              </div> 
              <span>Continue with Google</span></button>
          </form>
         );
}

export default Login;
