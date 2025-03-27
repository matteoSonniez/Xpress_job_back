const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "UserCompany", required: true },
  candidacys: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidacy" }], // 👈 Nouveau champ tableau de candidature
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", jobSchema);
