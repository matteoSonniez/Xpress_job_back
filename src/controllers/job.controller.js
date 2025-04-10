const Job = require("../models/job.model");
const Candidacy = require("../models/candidacy.model");

// Fonction de formatage pour un job
const formatJob = (jobDoc) => {
  const job = jobDoc.toObject();

  return {
    id: job._id,
    title: job.title,
    description: job.description,
    location: job.location,
    duration: job.duration,
    salary: job.salary,
    type: job.type,
    startDate: job.startDate,
    endDate: job.endDate,
    requirements: job.requirements,
    contactEmail: job.contactEmail,
    workingHours: job.workingHours,
    accommodation: job.accommodation,
    mealsIncluded: job.mealsIncluded,
    keywords: job.keywords,
    tags: job.tags,
    company: {
      id: job.company._id,
      name: job.company.name
    }
  };
};

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
      company,
      keywords,
      tags
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
      company,
      keywords,
      tags
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
    let excludedJobIds = [];

    if (req.user?.id) {
      const candidacies = await Candidacy.find({ applicant: req.user.id }).select("job");
      excludedJobIds = candidacies.map(c => c.job);
    }

    const jobs = await Job.find({ _id: { $nin: excludedJobIds } })
      .populate("company", "name")
      .select("-__v -deletedReason -candidacys -createdAt");

    const formattedJobs = jobs.map(formatJob);
    res.status(200).json(formattedJobs);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des offres",
      error: err
    });
  }
};

// Récupérer les offres d'une entreprise spécifique
exports.getJobsByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    const jobs = await Job.find({ company: companyId })
      .populate("company", "name")
      .select("-__v -deletedReason -candidacys -createdAt");

    const formattedJobs = jobs.map(formatJob);
    res.status(200).json(formattedJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des offres de l'entreprise",
      error: err.message
    });
  }
};

// Voir les détails d'une offre spécifique
exports.getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("company", "name")
      .populate({
        path: "candidacys",
        populate: {
          path: "applicant",
          select: "firstName lastName email"
        }
      });

    if (!job) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    const connectedUserId = req.user?.id;
    const jobObject = job.toObject();

    let applicationStatusMessage = null;

    if (connectedUserId) {
      const candidacy = jobObject.candidacys.find(
        c => c.applicant?._id.toString() === connectedUserId
      );

      if (candidacy) {
        if (candidacy.status === "accepted") {
          applicationStatusMessage = "Félicitations ! Votre candidature a été acceptée.";
        } else if (candidacy.status === "refused") {
          applicationStatusMessage = "Votre candidature a été refusée.";
        } else {
          applicationStatusMessage = "Votre candidature est en attente de validation.";
        }

        if (candidacy.status !== "accepted") {
          jobObject.contactEmail = null;
        }
      } else {
        jobObject.contactEmail = null;
      }
    } else {
      jobObject.contactEmail = null;
    }

    res.status(200).json({ ...jobObject, applicationStatusMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la récupération de l’offre",
      error: err.message
    });
  }
};

// Supprimer une offre
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { deletedReason } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    job.deletedReason = deletedReason || "Non spécifié";
    await job.save();
    // Supprimer les candidatures liées à cette offre
    await Candidacy.deleteMany({ job: jobId });
    await Job.findByIdAndDelete(jobId); 

    res.status(200).json({
      message: "Offre supprimée avec succès",
      deletedReason: job.deletedReason
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la suppression de l’offre",
      error: err.message
    });
  }
};

// Modifier une offre
exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updates = req.body;

    const job = await Job.findByIdAndUpdate(jobId, updates, {
      new: true,
      runValidators: true
    }).populate("company", "name");

    if (!job) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    res.status(200).json(formatJob(job));
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la modification de l’offre",
      error: err.message
    });
  }
};

// Recherche d'offres avec filtres
exports.searchJobs = async (req, res) => {
  try {
    const {
      location,
      duration,
      type,
      minSalary,
      workingHours,
      startDate,
      mealsIncluded,
      accommodation,
      keyword,
      tag
    } = req.query;

    const query = {};

    if (location) query.location = { $regex: location, $options: "i" };
    if (duration) query.duration = { $regex: duration, $options: "i" };
    if (type) query.type = type;
    if (minSalary) query.salary = { $gte: parseFloat(minSalary) };
    if (workingHours) query.workingHours = { $regex: workingHours, $options: "i" };
    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (mealsIncluded !== undefined) query.mealsIncluded = mealsIncluded === "true";
    if (accommodation !== undefined) query.accommodation = accommodation === "true";

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { keywords: { $regex: keyword, $options: "i" } }
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    let excludedJobIds = [];
    if (req.user?.id) {
      const candidacies = await Candidacy.find({ applicant: req.user.id }).select("job");
      excludedJobIds = candidacies.map(c => c.job);
      query._id = { $nin: excludedJobIds };
    }

    const jobs = await Job.find(query)
      .populate("company", "name")
      .select("-__v -deletedReason -candidacys -createdAt");

    const formattedJobs = jobs.map(formatJob);
    res.status(200).json(formattedJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la recherche", error: err.message });
  }
};