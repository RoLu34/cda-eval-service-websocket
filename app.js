import  {WebSocketServer} from 'ws';
import messageDispatcher from "./src/messageDispatcher.js";
import ip from "ip"

const wss = new WebSocketServer({ port: 8080 });

console.log(ip.address())

wss.on('connection', function connection(client) {

    console.log("hello !")

    client.on('message', function message(data) {

        messageDispatcher.dispatch(data, client)
        
    });
    
});
