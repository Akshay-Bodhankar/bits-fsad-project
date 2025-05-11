const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    vaccineName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    availableDoses: {
        type: Number
    },
    grades: {
        type: String
    },
    isExpired: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("VaccinationDrive", orgSchema);
