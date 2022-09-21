import messageSender from "./messageSender.js"
import messageTypesEnums from "./messageTypesEnums.js";
import keyGenerator from "./keyGenerator.js";

class RoomsManager {

    constructor(){
        this.maxClientsConnected = 5;
        this.rooms = {};
    }

    createRoom(payload, client) {

        const roomId = keyGenerator.genKey(10)

        this.rooms[roomId] = [client];

        const username = payload.username

        client["client_id"] = keyGenerator.genKey(5)
        client["username"] = username

        const reponse = {
            "type": messageTypesEnums.ROOM_INFO,
            "room": roomId,
            "client_id": client["client_id"],
            "username": username,
            "clients_list": this.getAllClientsByRoom(roomId),
        }

        client.send(JSON.stringify(reponse));

    }

    joinRoom(payload, client) {

        const roomId = payload.room;
        const username = payload.username
        
        if (!Object.keys(this.rooms).includes(roomId)) {
            console.log(`${roomId} doesn't exist !`);
            return;
        }

        if (this.rooms[roomId].length >= this.maxClientsConnected) {
            console.log(`${roomId} is full !`);
            return;
        }

        client["client_id"] = keyGenerator.genKey(5);
        client["username"] = username
        this.rooms[roomId].push(client);
        
        const response = {
            "type": messageTypesEnums.ROOM_INFO,
            "room": roomId,
            "client_id": client["client_id"],
            "username": username,
            "clients_list": this.getAllClientsByRoom(roomId)
        }

        client.send(JSON.stringify(response));
        this.notifyClientsOfClientsListChange(roomId)

    }

    leaveRoom(payload) {

        let roomId = payload.room;
        let client_id = payload.client_id

        this.rooms[roomId] = this.rooms[roomId].filter( client => {
            return client.client_id !== client_id
        });

        if(!this.closeRoomIfEmpty(roomId)){
            this.notifyClientsOfClientsListChange(roomId)
        }

    }

    closeRoomIfEmpty(roomId){

        if (this.rooms[roomId].length == 0){
            delete this.rooms[roomId]
            console.log(`Room ${roomId} deleted !`)
            return true
        }
        return false
        
    }

    getAllClientsByRoom(roomId){
        let clientsList = [];

        this.rooms[roomId].forEach( room => {
    
            clientsList.push({
                client_id: room.client_id,
                username: room.username
            })
    
        })

        return clientsList;
    }

    notifyClientsOfClientsListChange(roomId){
    
        messageSender.sendToRoom({
            "type": messageTypesEnums.CLIENTS_LIST,
            "room": roomId,
            "clients_list": this.getAllClientsByRoom(roomId)    
        })
    
    }

}

export default new RoomsManager()