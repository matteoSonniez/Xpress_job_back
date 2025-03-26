const Job = require("../models/job.model");

// Créer une offre
exports.createJob = async (req, res) => {
    try {
      const { title, description, location, duration, company } = req.body;
  
      const newJob = new Job({
        title,
        description,
        location,
        duration,
        company
      });
  
      const savedJob = await newJob.save();
      res.status(201).json(savedJob);
    } catch (err) {
      console.error(err); // 👈 très utile pour debug
      res.status(500).json({ message: "Erreur lors de la création de l’offre", error: err.message });
    }
  };
  

// Lister toutes les offres
exports.getAllJobs = async (req, res) => {
    try {
      const jobs = await Job.find().populate("company"); // 👈 Très important !
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des offres", error: err });
    }
  };
  