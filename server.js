const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/populatedb", { useNewUrlParser: true });

// Define routes here

// For /exercise route, serve exercise.html
app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/exercise.html'));
  });

// For /stats route, serve stats.html
app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/stats.html'));
  });

// Get all workouts
// GET: /api/workouts
app.get("/api/workouts", (req, res) => {
    db.Workout.find({})
        .populate("exercises")
        .then(dbWorkouts => {
            res.json(dbWorkouts);
        })
        .catch(err => {
            res.json(err);
        });
});

// Create a workout
// POST: /api/workouts
app.post("/api/workouts", (req, res) => {
    db.Workout.create(req.body)
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

// Add an exercise to a workout
// PUT: /api/workouts/id
app.put("/api/workouts/:id", (req, res) => {   
    const currentDuration = req.body.duration;     // The duration of the current exercise
    
    db.Exercise.create(req.body)
        // Add the exercise to the workout specified by req.params.id
        .then(({ _id }) => db.Workout.findOneAndUpdate({ _id: mongojs.ObjectId(req.params.id) }, { $push: { exercises: _id } }, { new: true }))
        
        // Update the totalDuration for the workout based on the duration of the new exercise
        .then(dbWorkout => db.Workout.findOneAndUpdate({ _id: mongojs.ObjectId(req.params.id) }, { $set: { totalDuration: currentDuration + dbWorkout.totalDuration} }))
       
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);                   
        });
})

// Get all workouts in a range
// GET: /api/workouts/range
app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({})
        .populate("exercises")
        .then(dbWorkouts => {
            res.json(dbWorkouts);
        })
        .catch(err => {
            res.json(err);
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });