const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    const payload = jwt.decode(token);
    if (!payload || !payload.email) {
      return res
        .status(401)
        .json({errors: [{msg:  "Access denied" }]});
    }
  }

  next();
};
