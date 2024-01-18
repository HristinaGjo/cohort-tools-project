const express = require('express');
const { errorHandler, notFoundHandler } = require('./middleware/error-handling');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const cohorts = require ('./cohorts.json');
const students = require ('./students.json');
const Cohort = require ('./models/Cohorts.model')
const Student = require ('./models/Students.model')
const mongoose = require('mongoose')
const PORT = 5005;
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

const MONGODB_URI = "mongodb://127.0.0.1:27017/cohort-tools-api";

mongoose
  .connect(MONGODB_URI)
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to mongo", err));

app.get('/api/students/static', (request, response) => {
  response.json(students)
}); 

const studentRoutes= require('./routes/students.js')
const cohortsRoutes= require('./routes/cohorts.js')
app.use('/api/students', studentRoutes)
app.use('/api/cohorts', cohortsRoutes)

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


