const WebSocket = require("ws");
const logger = require("./logger");

let wss;

function setupWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    logger.info("New client connected");

    ws.on("close", () => {
      logger.info("Client disconnected");
    });
  });
}

function getWSS() {
  if (!wss) {
    throw new Error("WebSocket server is not initialized yet!");
  }
  return wss;
}

module.exports = { setupWebSocket, getWSS };
