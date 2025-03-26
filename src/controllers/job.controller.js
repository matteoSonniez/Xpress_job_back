const Job = require("../models/job.model");

// Créer une offre
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      duration,
      salary,
      type,
      startDate,
      endDate,
      requirements,
      contactEmail,
      workingHours,
      accommodation,
      mealsIncluded,
      company
    } = req.body;

    const newJob = new Job({
      title,
      description,
      location,
      duration,
      salary,
      type,
      startDate,
      endDate,
      requirements,
      contactEmail,
      workingHours,
      accommodation,
      mealsIncluded,
      company
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la création de l’offre",
      error: err.message
    });
  }
};

// Lister toutes les offres
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("company");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des offres",
      error: err
    });
  }
};

// Voir les détails d'une offre spécifique
exports.getJobById = async (req, res) => {
    try {
      const jobId = req.params.id;
  
      const job = await Job.findById(jobId)
        .populate("company")
        .populate({
          path: "candidacys",
          populate: {
            path: "applicant",
            select: "-password" // cache le mdp si jamais il existe dans le modèle
          }
        });
  
      if (!job) {
        return res.status(404).json({ message: "Offre non trouvée" });
      }
  
      res.status(200).json(job);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Erreur lors de la récupération de l’offre",
        error: err.message
      });
    }
  };
  
  exports.deleteJob = async (req, res) => {
    try {
      const jobId = req.params.id;
  
      const deleted = await Job.findByIdAndDelete(jobId);
  
      if (!deleted) {
        return res.status(404).json({ message: "Offre non trouvée" });
      }
  
      res.status(200).json({ message: "Offre supprimée avec succès" });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Erreur lors de la suppression de l’offre",
        error: err.message
      });
    }
  };
  