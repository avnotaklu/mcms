const express = require("express");
const { validateAuthParams } = require("../dto/auth_dto");
const { verifyToken } = require("../middlewares/auth_middleware");

function userRouter(userController) {
  const router = express.Router();
  /**
   * @swagger
   * tags:
   *   name: Authentication
   *   description: User authentication routes
   */

  /**
   * @swagger
   * /api/user/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     description: Creates a new user account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - password
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: johndoe@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: SecurePass123!
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Invalid request body
   */
  router.post("/register", validateAuthParams, userController.register);

  /**
   * @swagger
   * /api/user/log-in:
   *   post:
   *     summary: Log in an existing user
   *     tags: [Authentication]
   *     description: Authenticates a user and returns a JWT token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: johndoe@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: SecurePass123!
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   example: "jwt.token.here"
   *       401:
   *         description: Unauthorized (Invalid credentials)
   */
  router.post("/log-in", validateAuthParams, userController.logIn);

  /**
   * @swagger
   * /api/user/log-out:
   *   post:
   *     summary: Log out the current user
   *     tags: [Authentication]
   *     description: Logs out a user by invalidating their session
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully logged out
   *       401:
   *         description: Unauthorized
   */
  router.post("/log-out", verifyToken, userController.logout);

  return router;
}

module.exports = {
  userRouter,
};
