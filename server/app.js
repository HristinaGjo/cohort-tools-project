const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cohorts = require ('./cohorts.json');
const students = require ('./students.json');
const cors = require("cors");

const mongoose = require('mongoose')
mongoose.connect("mongodb://192.168.178.55:27017/cohort-tools-api")

const PORT = 5005;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(
  cors({
    origin: ['http://localhost:5173']
  })
);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Check Mongoose connection

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get('/api/cohorts', (request, response) => {
  response.json(cohorts)
});

app.get('/api/students', (request, response) => {
  response.json(students)
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});