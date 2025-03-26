const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },

  salary: { type: Number }, // € par heure ou jour
  type: { type: String, enum: ["CDD", "Intérim", "Stage", "Saisonnier", "Autre"], default: "Saisonnier" },
  startDate: { type: Date },
  endDate: { type: Date },
  requirements: [{ type: String }],
  contactEmail: { type: String },
  workingHours: { type: String },
  accommodation: { type: Boolean, default: false },
  mealsIncluded: { type: Boolean, default: false },

  company: { type: mongoose.Schema.Types.ObjectId, ref: "UserCompany", required: true },
  candidacys: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidacy" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", jobSchema);
