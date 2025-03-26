const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérifie que l'email existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    // 2. Compare le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    // 3. Crée un token JWT
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        isCompany: user.isCompany
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Retourne le token + user
    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isCompany: user.isCompany
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la connexion", error: err.message });
  }
};
