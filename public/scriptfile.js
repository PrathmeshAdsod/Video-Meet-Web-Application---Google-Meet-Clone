

/* I was getting error that io is not defined
   I solved it by below two lines 
   const server = require('http').Server(app);
   const io = require('socket.io')(server)
   Before that i used socket io as const io = require('socket.io')() only
*/
const socket = io()

const myVideo = document.createElement('video')
myVideo.muted = true

var Peer = new Peer({
    path: '/peerjs',
    host: '/',
    port: '8000'
});

console.log(ID);

let streamingVideo

navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
    streamingVideo = stream
    console.log(streamingVideo);

    addVideoStream(myVideo, stream)
    socket.on('userConnected', (peerId) => {
        newUserConnected(peerId,stream);
    })
})

Peer.on('call',(call) => {  
    call.answer(streamingVideo)
    const video = document.createElement('video')
    call.on('stream', (userVideoStream) => {
        addVideoStream(video , userVideoStream)
    })
}) 

// client-side
Peer.on('open', (peerId) => {
    socket.emit('roomJoined', ID, peerId);
})

const newUserConnected = (peerId,stream) => {
    console.log('New User Connected ', peerId);
    const call = Peer.call(peerId , stream)
    const video = document.createElement('video')
    call.on('stream' , (userVideoStream) => {
        addVideoStream(video , userVideoStream)
    })
}
const addVideoStream = (video, stream) => {
    video.srcObject = stream

    video.addEventListener('loadedmetadata', () => {
        video.play();
    })

    document.getElementById('videoItem').append(video)

}


const setMessage = () => {
    let message = document.getElementById('msg').value
    console.log(message);
    socket.emit('message' , message)
    document.getElementById('msg').value = ''
}


socket.on('createMessage' , (msg) => {
    // Create element:
     const para = document.createElement("p")
     para.innerHTML = msg
    // Append to another element:
    document.getElementById("chat_element").appendChild(para)

    var myDiv = document.getElementById("chat_element");
    myDiv.scrollTop = myDiv.scrollHeight;
})

const muteORunmute = () => {
    const enabled = streamingVideo.getAudioTracks()[0].enabled
    console.log(enabled);
    if(enabled) {
        streamingVideo.getAudioTracks()[0].enabled = false
        document.querySelector('.control_audio_item').innerHTML = `<i onclick="muteORunmute()" class="fa-solid fa-microphone-slash"></i>`
    }else {
        streamingVideo.getAudioTracks()[0].enabled = true
        document.querySelector('.control_audio_item').innerHTML = `<i onclick="muteORunmute()" class="fa-solid fa-microphone"></i>`
    }
}


const stopORshow = () => {
    const enabled = streamingVideo.getVideoTracks()[0].enabled
    console.log(enabled);
    if(enabled) {
        streamingVideo.getVideoTracks()[0].enabled = false
        document.querySelector('.control_video_item').innerHTML =  ` <i onclick="stopORshow()" class="fa-solid fa-video-slash"></i>`
    }else {
        streamingVideo.getVideoTracks()[0].enabled = true
        document.querySelector('.control_video_item').innerHTML = ` <i onclick="stopORshow()" class="fa-solid fa-video"></i>`
    }
}
