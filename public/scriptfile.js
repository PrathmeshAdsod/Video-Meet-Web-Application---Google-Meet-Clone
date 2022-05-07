

/* I was getting error that io is not defined
   I solved it by below two lines 
   const server = require('http').Server(app);
   const io = require('socket.io')(server)
   Before that i used socket io as const io = require('socket.io')() only
*/
const socket = io()


console.log(document.getElementById('videoItem'));

const myVideo = document.createElement('video')
myVideo.muted = true

var Peer = new Peer({
    path: '/peerjs',
    host: '/',
    port: '8000'
});

let streamingVideo

navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then((stream) => {
    streamingVideo = stream

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
