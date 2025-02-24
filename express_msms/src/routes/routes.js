const express = require("express");

function routes(userRouter, customerRouter) {
  const router = express.Router();

  router.use("/user", userRouter);
  router.use("/customer", customerRouter);

  return router;
}

module.exports = { routes };
