
const express = require('express');
const app = express();

const path = require('path');
const {nanoid} = require('nanoid');

/* This -- const server = require('http').Server(app) --
   we have to do for working express with socket.io 
   other wise we can do directly app.listen(PORT)
*/   
const server = require('http').Server(app);
const io = require('socket.io')(server)
ID  = nanoid();

const {ExpressPeerServer} = require('peer');
// Now peerServer will be able to work with express
const peerServer = ExpressPeerServer(server , {
   debug : true
})


app.use('/peerjs' , peerServer);

app.set('view engine' , 'ejs')

app.use('/public' , express.static('./public/'))

app.get('/' , (req,res) => {
   res.redirect(`/${ID}`)
})

app.get('/:room' , (req,res) => {
  // res.sendFile(path.join(__dirname + '/weblook/room.ejs'))
  res.render('room', { ID: req.params.room })
})

io.on('connection' , (socket) => {
   socket.on('roomJoined' , (ID , peerId) => {
      socket.join(ID);
      // emitting when user joined
      socket.to(ID).emit('userConnected' , peerId);
   })
})


server.listen(8000 , () => {
    console.log(`Server is listening on http://localhost:8000`);
})


