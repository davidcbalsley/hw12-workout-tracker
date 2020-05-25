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
    db.Exercise.create(req.body)
        .then(({ _id }) => db.Workout.findOneAndUpdate({ _id: mongojs.ObjectId(req.params.id) }, { $push: { exercises: _id } }, { new: true }))
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);                   
        });
})

// Get all exercises for a given workout id
// GET: /exercises/:id
/*
app.get("/exercises/?id=:id", (req, res) => {
    db.Workout.findOne(mongojs.ObjectId(req.params.id), (err, { exercises }) => {
        if (err) {
            res.send(err);
        } else {
            res.json(exercises);
        }
    });
});
*/

// Start the server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });