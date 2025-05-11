const mongoose = require("mongoose");

const vaccinationRecordSchema = new mongoose.Schema({
    driveId: {
      type: String,
      required: true
    },
    vaccineName: String, 
    date: Date
  });

const orgSchema = new mongoose.Schema({
    studentID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    vaccinationRecords: {
        type: [vaccinationRecordSchema],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Students", orgSchema);
