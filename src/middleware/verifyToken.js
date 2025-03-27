const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded,"ajjjj")
    req.user = decoded; // On stocke l'info dans req.user pour l'utiliser après
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré", error: err.message });
  }
};

module.exports = verifyToken;
