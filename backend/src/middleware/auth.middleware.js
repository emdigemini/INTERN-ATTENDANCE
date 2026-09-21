import jwt from 'jsonwebtoken';

export const authentication = async (req, res, next) => {
  const token = req.cookies?.security_id;
  if (!token)
    return res.status(401).end();

  try {
    const admin = jwt.verify(token, process.env.JWT_SECRET_SUPER);
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}