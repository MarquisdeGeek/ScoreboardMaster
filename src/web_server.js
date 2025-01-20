const path = require('path')
const express = require('express')
const { networkInterfaces } = require('os');


function WebServer(port, portSockets) {

    (function ctor() {
      const nets = networkInterfaces();
      let ipAddress = `localhost`;

      // A quick and dirty way to get an address
      Object.keys(nets).forEach((iface) => {
        nets[iface].forEach((addr) => {
          if (!addr.internal && addr.family === 'IPv4') {
            ipAddress = addr.address;
          }
        })
      });

      const publicPath = path.join(__dirname, "public_html");
      const app = express()
      app.get('/socket_address.js', function(req, res) {

        const data = `const socketAddress = "ws://${ipAddress}:${portSockets}/"`;

        res.send(data);
      });
      app.use(express.static(publicPath))

      app.listen(port, '0.0.0.0', () => {
        console.log(`Listening:`);
        console.log(`http://${ipAddress}:${port}`);
      });


    })();

    return {

    }
}


module.exports = WebServer;
