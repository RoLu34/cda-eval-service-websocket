import roomsManager from "./roomsManager.js"
import messageSender from "./messageSender.js"
import messageTypesEnums from "./messageTypesEnums.js";

function dispatch(data, client){
    const payload = JSON.parse(data);
    console.log(payload)

    switch (payload.type) {
        case messageTypesEnums.CREATE_ROOM:
            create(payload, client)
            break;

        case messageTypesEnums.JOIN_ROOM:
            join(payload, client);
            break;

        case messageTypesEnums.LEAVE_ROOM:
            leave(payload);
            break;

        case messageTypesEnums.CHAT:
            chat(payload);
            break;

        default:
            console.log("Invalid type");
            break;
    }
}

function create(payload, client){
    roomsManager.createRoom(payload, client)
}

function join(payload, client){
    roomsManager.joinRoom(payload, client)
}

function leave(payload){
    roomsManager.leaveRoom(payload)
}

function chat(payload){
    messageSender.sendToRoomAndToTheDatabase(payload)
}

export default {
    dispatch
}