const mongoose = require("mongoose");

/**
 * Middleware pour vérifier si l'utilisateur est propriétaire d'une ressource
 * @param {Model} model - Le modèle mongoose (Job, Candidacy, etc.)
 * @param {string} modelKey - Le champ de référence (ex: 'company', 'applicant')
 */
const isOwnerOnly = (model, modelKey) => {
  return async (req, res, next) => {
    try {
      const id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }

      const resource = await model.findById(id);
      if (!resource) {
        return res.status(404).json({ message: "Ressource non trouvée" });
      }

      // ⚠️ On compare l’ID du champ avec celui de l’utilisateur connecté
      if (resource[modelKey].toString() !== req.user.id) {
        return res.status(403).json({ message: "Accès refusé : vous n'êtes pas le propriétaire" });
      }

      next(); // ✅ L'utilisateur est bien le propriétaire
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  };
};

module.exports = isOwnerOnly;
