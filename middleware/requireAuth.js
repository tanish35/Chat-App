import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (Date.now() >= decoded.exp) {
      res.sendStatus(401);
      return;
    }
    const user = await User.findById(decoded.sub);
    if (!user) {
      res.sendStatus(401);
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.sendStatus(401);
  }
}

function checkAuth(req, res) {
  res.sendStatus(200);
}

export { requireAuth, checkAuth };
