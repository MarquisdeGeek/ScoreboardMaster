require("dotenv").config();

const WebServer = require("./web_server.js", 0);
const SocketServer = require("./sockets_server.js");
const Scoreboard = require("./scoreboard.js");

const scoreboard = new Scoreboard();
const web = new WebServer(process.env.PORT_WEBSERVER, process.env.PORT_SOCKETS);
const ss = new SocketServer(process.env.PORT_SOCKETS, {
    onConnect: ()=>{
        // NOP
    },
    onMessage: (msg)=>{
        const response = scoreboard.onMessage(msg);
        ss.sendData(response);
    }
});

