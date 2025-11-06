const mongoose = require('mongoose');
const schema = mongoose.Schema;

let patientSchema = new schema({
    Gender: { type: String },
    HeightCm: { type: Number, required: true },
    WeightKg: { type: Number, required: true },
    BMI: { type: Number },
    BMICategory: { type: String },
    HealthRisk: { type: String },
});

module.exports = mongoose.model('patient', patientSchema);
