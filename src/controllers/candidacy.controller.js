
// POST - postuler à une offre
const Candidacy = require("../models/candidacy.model");
const Job = require("../models/job.model"); // 👈 on importe Job
const User = require("../models/user.model")

exports.applyToJob = async (req, res) => {
    try {
      const { jobId, applicantId, message } = req.body;
  
      // Vérifier si l'utilisateur a déjà postulé à ce job
      const existingApplication = await Candidacy.findOne({
        job: jobId,
        applicant: applicantId
      });
  
      if (existingApplication) {
        return res.status(400).json({
          message: "Vous avez déjà postulé à cette offre."
        });
      }
  
      // Créer la candidature
      const newApplication = new Candidacy({
        job: jobId,
        applicant: applicantId,
        message
      });
  
      const saved = await newApplication.save();
  
      // Ajouter l'utilisateur au champ `applicants` du job (sans doublons)
      await Job.findByIdAndUpdate(
        jobId,
        { $addToSet: { candidacys: newApplication._id } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        applicantId,
        { $addToSet: { candidacy: newApplication._id } },
        { new: true }
      );
  
      res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Erreur lors de la candidature",
        error: err.message
      });
    }
  };


// GET - toutes les candidatures pour une offre
exports.getCandidacysByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const candidacys = await Candidacy.find({ job: jobId })
      .populate("applicant", "-password")
      .populate("job");

    res.status(200).json(candidacys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des candidatures", error: err.message });
  }
};

exports.getCandidacysByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const candidacys = await Candidacy.find({ applicant: userId })
        .populate("job");
  
      res.status(200).json(candidacys);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération des candidatures", error: err.message });
    }
};
  