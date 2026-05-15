// atk-appServer v1.5
const express = require("express");
const app = express();
const { createServer } = require("http");
const http = createServer(app);
const fs = require("fs");
const os = require("os");
const { exec } = require("node:child_process");

// CONFIG
const siteName = "Pomodoro";
let port = 28000;
if (process.argv[2] === '-p') { port = process.argv[3] }
else {
  let testPort = 28000;
  while (!port && testPort < 65535) {
    exec(`lsof -i :${testPort}`, (error, stdout,stderr) => {stderr && (port = testPort)})
    testPort++
  }
};
let localIP;

// MIDDLEWARE
app.use(express.static('/assets'));

app.use((req, res, next) => { // For every static request; log a message
  writeLog(`REQUEST FROM: ${req.host} | date: ${new Date().toISOString()} | ${req.method}:${req.url}`);
  next();
});

// HELPER FUNCTIONS
function writeLog(message) {
  var stream = fs.createWriteStream("log.txt", { flags: "a" });
  stream.write(message + "\n");
  stream.end();
  console.log(message+"\n");
}

(function setLocalIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    for (const iface of networkInterface) {
      // Filter for IPv4 addresses that are not internal (loopback)
      if (iface.family === 'IPv4' && !iface.internal) {
        localIP = iface.address;
        writeLog(`localIP acquired: ${localIP}`)
      }
    }
  };
  if (!localIP) {
    localIP = 'localhost';
    writeLog(`Error! Could not find a local IP address. Setting localhost instead.`);
  }
})();

// ROUTES
app.get("/", (req, res) => {
  res.sendFile(__dirname+'/index.html');
  const logMessage = `date: ${new Date().toISOString()}
      host: ${req.host}
      ip: ${req.ip}
      request: ${req.method}
      response: sendFile => index.js
      site: ${siteName}`;
  writeLog(logMessage);
});

// LISTEN
http.listen(port, () => {
  writeLog(`${siteName} Server Listening on Port ${port} @ ${new Date().toISOString()} from ${__dirname}`);
  console.log(`Access at [ http://${localIP}:${port} ]\n`);
});
