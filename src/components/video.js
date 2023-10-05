import { useEffect, useRef, useState } from "react";

function Video({peer,remotePeerId,setCall}){

    const callBtn = useRef()
    const ourVideo = useRef()
    const remoteVideo = useRef()
    const [video,setVideo] = useState(true)

    const call = (id) => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({video: video, audio: true},(stream) => {
            ourVideo.current.srcObject = stream
            ourVideo.current.muted = true
            var call = peer.call(id, stream);
            call.on('stream', function(remoteStream) {
                remoteVideo.current.srcObject = remoteStream
            });
            }, (err) => {
            console.log('Failed to get local stream' ,err);
        })
    }

    const answer = () => {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        peer.on('call', (call) => {
        getUserMedia({video: video, audio: true}, (stream) => {
            ourVideo.current.srcObject = stream
            ourVideo.current.muted = true
            call.answer(stream); // Answer the call with an A/V stream.
            call.on('stream', function(remoteStream) {
                remoteVideo.current.srcObject = remoteStream
            });
        }, (err) => {
            console.log('Failed to get local stream' ,err);
        });
        });
    }

    useEffect(() => {
        callBtn.current.click()
        answer()
    },[call])
    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault()
                call(remotePeerId)
                }}>
                <button ref={callBtn} hidden>Call</button>
            </form>
            <div className="video-chat">
                <div>
                    <video id="our" autoPlay ref={ourVideo}/>
                    {/* <button onClick={() => {
                        setVideo((prev) => (!prev))
                    }}>video</button> */}
                </div>
                <div>
                    <video id="remote" autoPlay ref={remoteVideo}/>
                </div>
            </div>
        </>
    )
}

export default Video