const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  type: {
    type: String,
    trim: true,
    enum: ["cardio", "resistance"],
    required: "type is required"
  },
  
  name: {
    type: String,
    trim: true,
    required: "name is required"
  },

  distance: Number,

  duration: Number,

  weight: Number,

  sets: Number,

  reps: Number,

  duration: Number
});

const Library = mongoose.model("Exercise", ExerciseSchema);

module.exports = Library;