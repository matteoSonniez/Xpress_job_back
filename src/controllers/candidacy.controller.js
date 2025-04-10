
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
  
exports.updateCandidacyStatus = async (req, res) => {
  try {
    const candidacyId = req.params.id;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide. Choisissez 'accepted' ou 'rejected'." });
    }

    const updated = await Candidacy.findByIdAndUpdate(
      candidacyId,
      { status },
      { new: true }
    ).populate("job").populate("applicant", "-password");

    if (!updated) {
      return res.status(404).json({ message: "Candidature introuvable." });
    }

    res.status(200).json({
      message: `Statut mis à jour : ${status}`,
      candidacy: updated
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la mise à jour du statut de la candidature",
      error: err.message
    });
  }
};
exports.getRefusedCandidaciesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const candidacys = await Candidacy.find({ applicant: userId, status: "refused" })
      .populate({
        path: "job",
        select: "-__v -candidacys -deletedReason"
      });

    res.status(200).json(candidacys);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des candidatures refusées",
      error: err.message
    });
  }
};

exports.getAcceptedCandidaciesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const candidacies = await Candidacy.find({
      applicant: userId,
      status: "accepted"
    }).populate("job");

    res.status(200).json(candidacies);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des candidatures acceptées",
      error: err.message
    });
  }
};
