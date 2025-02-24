const http = require("http");
const { setupApp } = require("./app"); // Import Express app
const { setupWebSocket } = require("./config/websocket");
const { createIndex } = require("./config/db");
const logger = require("./config/logger");

const { userService } = require("./services/user.service");
const { userController } = require("./controllers/user.controller");
const { userRouter } = require("./routes/user.routes");

const { customerService } = require("./services/customer.service");
const { customerController } = require("./controllers/customer.controller");
const { customerRouter } = require("./routes/customer.routes");

const { routes } = require("./routes/routes");

require("dotenv").config(); // Load environment variables

const PORT = 8080;

const _userRouter = userRouter(userController(userService()));
const _customerRouter = customerRouter(customerController(customerService()));

const _router = routes(_userRouter, _customerRouter);

// Create HTTP server (for both Express & WebSockets)
const server = http.createServer(setupApp(_router));

// Initialize WebSocket Server
setupWebSocket(server);

server.listen(PORT, () => {
  const indexes = ["users", "customers"];

  for (const index of indexes) {
    createIndex(index);
  }

  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
