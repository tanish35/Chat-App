import jwt from "jsonwebtoken";

export default function generateToken(user) {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
  const token = jwt.sign({ sub: user, exp }, process.env.JWT_SECRET);
  return token;
}
