const User = require("../models/user.model");
const UserCompany = require("../models/usercompany.model"); // Assurez-vous du bon chemin vers votre modèle
const bcrypt = require("bcrypt");
const signJwt = require("../utils/signJwt");
const jwt = require("jsonwebtoken"); // Import de jsonwebtoken


// Fonction pour l'inscription d'un utilisateur
exports.registerUser = async (req, res) => {
  try {
    console.log(req.body);
    const { firstName, lastName, email, phone, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password, // le pre('save') du modèle hachera le mot de passe automatiquement
    });

    await newUser.save();

    // Générer le token JWT pour l'utilisateur nouvellement créé
    let userToken = signJwt({
      id: newUser._id,
      isAdmin: newUser.isAdmin,
      isCompany: newUser.isCompany
    });

    // Retourner le token dans la réponse
    res.status(201).json({
      success: true,
      message: "Inscription réussie.",
      token: userToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};

exports.registerUserCompany = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, phone, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await UserCompany.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    // Créer un nouvel utilisateur
    const newUser = new UserCompany({
      name,
      email,
      phone,
      password,
    });

    await newUser.save();

    // Générer le token JWT pour l'utilisateur nouvellement créé
    let userToken = signJwt({
      id: newUser._id,
      isAdmin: newUser.isAdmin,
      isCompany: newUser.isCompany
    });

    // Retourner le token dans la réponse
    res.status(201).json({
      success: true,
      message: "Inscription réussie.",
      token: userToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};

// Fonction pour la connexion d'un utilisateur
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Chercher l'utilisateur par email
    const user = await User.findOne({ email });
    const usercompany = await UserCompany.findOne({ email });
    if (!user && !usercompany) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    if (!user) {
      const isMatch = await bcrypt.compare(password, usercompany.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Identifiants invalides." });
      }

      // Générer un token JWT pour l'utilisateur
      let userToken = signJwt({
        id: usercompany._id,
        isAdmin: usercompany.isAdmin,
        isCompany: usercompany.isCompany
      });

      return res.send({
        success: true,
        message: "Utilisateur connecté",
        token: userToken,
      });
    }
    if (!usercompany) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Identifiants invalides." });
      }

      // Générer un token JWT pour l'utilisateur
      let userToken = signJwt({
        id: user._id,
        isAdmin: user.isAdmin,
        isCompany: user.isCompany
      });

      return res.send({
        success: true,
        message: "Utilisateur connecté",
        token: userToken,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
};

// Fonction pour récupérer les données d'un utilisateur à partir du token
exports.getUser = async (req, res) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization (format : "Bearer <token>")
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Pas de token fourni." });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token manquant." });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Token invalide." });
    }

    // Utiliser l'identifiant du token pour récupérer l'utilisateur dans la BDD
    const user = await User.findById(decoded.id).select("-password"); // Exclut le mot de passe
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des données." });
  }
};
