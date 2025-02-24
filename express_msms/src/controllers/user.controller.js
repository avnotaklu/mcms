require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const logger = require("../config/logger");

function userController(userService) {
  const logIn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      let user = await userService.findUserByEmail(email);

      if (!user) {
        return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
      }

      let hashed_password = user.password;

      if (!(await bcrypt.compare(password, hashed_password))) {
        return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
      }

      // No expiration time for now
      const acc_token = jwt.sign({ email: email }, process.env.JWT_SECRET);

      res.cookie("token", acc_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      logger.info(`User ${email} logged in`);

      res.json({ acc_token });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

  const logout = async (req, res) => {
    res.clearCookie("token");
    res.json({ msg: "Logged out" });
  };

  const register = async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const oldUser = await userService.findUserByEmail(email);

      if (oldUser) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      let phash = await bcrypt.hash(password, 10);

      var response = await userService.addUser(email, phash);

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

  return {
    register,
    logIn,
    logout
  }
}

module.exports = {
  userController,
};
