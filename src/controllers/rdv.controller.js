const User = require("../models/user.model");
const Rdv = require("../models/rdv.model");
const UserCompany = require("../models/usercompany.model"); // Assurez-vous du bon chemin vers votre modèle

// Fonction pour créer un rendez-vous
exports.CreateRdv = async (req, res) => {
  try {
    // Extraction des données du corps de la requête
    const { title, date, isVisio, user, userCompany, lieu } = req.body;

    // Vérification des champs requis
    if (!title || !date || !user || !userCompany || !lieu) {
      return res.status(400).json({ message: "Veuillez fournir tous les champs requis : title, date, user, utilisateurcompagnie et lieu." });
    }

    // Création du rendez-vous
    const newRdv = new Rdv({
      title,
      date,
      isVisio: isVisio || false, // Par défaut false si non précisé
      user,
      userCompany,
      lieu
    });

    // Sauvegarde en base de données
    const savedRdv = await newRdv.save();

    return res.status(201).json({ message: "Rendez-vous créé avec succès", rdv: savedRdv });
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous :", error);
    return res.status(500).json({ message: "Erreur lors de la création du rendez-vous", error });
  }
};
