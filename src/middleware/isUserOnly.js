const isUserOnly = (req, res, next) => {
    if (req.user?.isCompany) {
      return res.status(403).json({
        message: "Accès réservé aux utilisateurs particuliers."
      });
    }
  
    next(); // ✅ C’est un utilisateur (non entreprise)
  };
  
  module.exports = isUserOnly;
  