import roomsManager from "./roomsManager.js"
import axios from 'axios'

function sendToOne(payload){

    const roomId = payload.room;
    const clientId = payload.client_id
    const receiverId = payload.receiver_id

    let targets = roomsManager.rooms[roomId].filter( client => {
        return client.client_id === receiverId || client.client_id === clientId
    });

    targets.forEach( target => {
        target.send(JSON.stringify(payload))
    })

}

function sendToRoom(payload){

    roomsManager.rooms[payload.room].forEach(session => 
        session.send(JSON.stringify(payload))
    );

}

function sendToRoomAndToTheDatabase(payload){

    roomsManager.rooms[payload.room].forEach(session => 
        session.send(JSON.stringify(payload))
    );

    axios.post('http://localhost:3001/message', { 
        content: payload.content, 
        username: payload.username, 
        roomId: payload.roomId,
        date: payload.date
    })

}

function sendToRoomButNotToTheSender(payload){

    const roomId = payload.room;
    const clientId = payload.client_id

    let targets = roomsManager.rooms[roomId].filter( client => {
        return client.client_id !== clientId
    });

    targets.forEach( target => {
        target.send(JSON.stringify(payload))
    })

}

export default {
    sendToOne,
    sendToRoom,
    sendToRoomButNotToTheSender,
    sendToRoomAndToTheDatabase
}