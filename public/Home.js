
const socket = io()

const createNewMeet = (ID) => {
    try {
       // console.log("ID on script file is ", ID);
      socket.emit('userJoined', ID);
      location.href = `http://localhost:8000/${ID}`;
    }catch(e) {
        console.log(e);
    }
}

createMeet.addEventListener('click' , createNewMeet)
