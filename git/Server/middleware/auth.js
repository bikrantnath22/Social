const jwt = require("jsonwebtoken");
const injectToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (token) {
      req.token = token;
    }
  }
  next();
};

const isAuth = (req, res, next) => {
  if (req?.token) {
    //validate jwt
    try {
      const payload = jwt.verify(req.token, process.env.JWT_SECRET);
      req.user = payload;
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ success: false, message: "Session expired!", expired: true });
      }
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized", expired: false });
    }
  }
  return res
    .status(401)
    .json({ success: false, message: "Unauthorized", expired: false });
};

const isAdmin = (req, res, next) => {
  if (req?.user?.account_type == "admin") {
    return next();
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized", expired: false });
  }
};

module.exports = { injectToken, isAuth, isAdmin };
