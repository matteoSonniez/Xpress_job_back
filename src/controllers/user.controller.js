const User = require('../models/user.model'); // Assurez-vous du bon chemin vers votre modèle
const bcrypt = require("bcrypt");
const signJwt = require('../utils/signJwt');

// Fonction pour l'inscription d'un utilisateur
exports.registerUser = async (req, res) => {
  try {
    console.log(req.body)
    const { firstName, lastName, email, phone, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password, // le pre('save') du modèle hashera le mot de passe automatiquement
    });

    await newUser.save();
    res.status(201).json({ message: "Inscription réussie.", user: newUser });
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
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Comparer le mot de passe fourni avec le mot de passe hashé en base
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides." });
    }

    // Vous pouvez ici générer un token JWT si nécessaire
    let userToken = signJwt({
      id: user._id,
      isAdmin: user.isAdmin
    })

    return res.send({
      success: true,
      message: "Utilisateur connecté",
      token: userToken
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
};

// Fonction pour récupérer les données d'un utilisateur
exports.getUser = async (req, res) => {
  try {
    // On suppose que l'identifiant de l'utilisateur est passé dans req.params.id
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password'); // Exclut le mot de passe
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des données." });
  }
};
