import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyCbi9II7yQq0P4-4nsWBOVIcwE-1byrK3Q",
    authDomain: "chat-app-992be.firebaseapp.com",
    projectId: "chat-app-992be",
    storageBucket: "chat-app-992be.appspot.com",
    messagingSenderId: "196382722744",
    appId: "1:196382722744:web:c01687df5b80aab8f6024d",
    measurementId: "G-9GWL45ZJNK"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
// const storage = getStorage()
// const storageRef = ref(storage)

// export const uploadToCloud = async (user,dataURL) => {
//   const profileRef = ref(storageRef,`images/${user}.jpg`)

//   uploadString(profileRef,dataURL,'data_url')
//   // console.log(res)
//   const url = await getDownloadURL(profileRef)
//   // console.log(url)
//   return url
// }
export const googleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    const data = await signInWithPopup(auth,provider)
    // console.log(data)
    return data
}
