const WebSocket = require("ws");
const { getWSS } = require("../config/websocket");
const uuid = require("uuid");

exports.sendNotification = async (
  message,
  { customerUpdate, customerData, deleteCustomer }
) => {
  const id = uuid.v4();
  let wss = getWSS();
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          id: id,
          message: message,
          customerUpdate,
          customerData,
          deleteCustomer,
        })
      );
    }
  });
};
