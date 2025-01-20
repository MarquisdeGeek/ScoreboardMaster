function SocketClient(address, cbHandler) {
let webSocket;

    (function ctor() {
        webSocket = new WebSocket(address);

        webSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            cbHandler.onMessage(data);
        };
        
        webSocket.addEventListener("open", () => {
            console.log("We are connected");
            cbHandler.onOpenSocket();
        });
    })();

    function sendData(msg) {
        return webSocket.send(JSON.stringify(msg));
    }

    return {
        sendData
    };
}

