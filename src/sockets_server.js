const { WebSocketServer } = require('ws');

function SocketServer(port, cbHandler) {
  let sockserver;

  (function ctor() {
      sockserver = new WebSocketServer({
          port: port
      })

      sockserver.on('connection', ws => {
          log('New client connected!');
          cbHandler.onConnect && cbHandler.onConnect(ws);

          ws.on('close', () => log('Client has disconnected!'))

          ws.on('message', data => {
              const packet = JSON.parse(data);
              cbHandler.onMessage && cbHandler.onMessage(packet);
          });

          ws.onerror = function() {
              log('websocket error')
              cbHandler.onError && cbHandler.onError();
          }
      })

  })();


  function log(msg) {
    //   console.log(msg);
  }

  function sendData(msg) {
      const msgString = JSON.stringify(msg);

      sockserver.clients.forEach((client) => {
          client.send(msgString)
      });
  }

  return {
      sendData
  }
}


module.exports = SocketServer;
