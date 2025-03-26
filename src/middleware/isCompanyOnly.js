const isCompanyOnly = (req, res, next) => {
    if (!req.user?.isCompany) {
      return res.status(403).json({
        message: "Accès réservé aux entreprises."
      });
    }
  
    next(); // ✅ L'utilisateur est bien une entreprise, on continue
  };
  
  module.exports = isCompanyOnly;
  