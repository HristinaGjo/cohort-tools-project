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

// Student Routes
app.get('/api/students/static', (request, response) => {
  response.json(students)
}); 

app.get('/api/students', async (request, response) => {
  try {
    const allStudents = await Student.find().populate('cohort');
    response.json(allStudents);
  } catch (error) {
    console.error("Error fetching students from database", error);
    response.status(500).json({ error, message: 'Something went wrong while fetching students' });
  }
});

app.post('/api/students', async (request, response) => {
  console.log(request.body)
  const payload = request.body
  try {
    const newStudent = await Student.create(payload)
    response.status(201).json(newStudent)
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      response.status(400).json({ error, message: 'Duplicate somewhere' })
    } else {
      response.status(500).json({ error, message: 'Somethin happened maybe on the server' })
    }
  }
})

app.get('/api/students/cohort/:cohortId', async (request, response) => {
  const { cohortId } = request.params;
  try {
    const studentsInCohort = await Student.find({ cohort: cohortId }).populate('cohort');
    response.json(studentsInCohort);
  } catch (error) {
    console.error("Error fetching students from database", error);
    response.status(500).json({ error, message: 'Something went wrong while fetching students in cohort' });
  }
});

app.get('/api/students/:studentId', async (request, response) => {
  const { studentId } = request.params;
  try {
    const oneStudent = await Student.findById(studentId).populate('cohort');
    response.json(oneStudent);
  } catch (error) {
      console.error("Error fetching student from database", error);
      response.status(500).json({ error, message: 'Something went wrong while fetching student' });
  }
});

app.put('/api/students/:studentId', async (request, response) => {
  console.log(request.body)
  const payload = request.body
  try {
    const updatedStudent = await Student.findByIdAndUpdate(request.params.studentId, payload, { new: true })
    response.status(202).json(updatedStudent)
  } catch (error) {
    console.log(error)
    response.status(500).json({ message: 'Something bad happened' })
  }
});

app.delete("/api/students/:studentId", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.studentId)
    res.status(204).json({message: 'The student was removed from the DB'})

  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
});

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//Cohort Routes
app.get('/api/cohorts/static', (request, response) => {
  response.json(cohorts)
});

app.get('/api/cohorts', async (request, response) => {
  try {
    const allCohorts = await Cohort.find({});
    response.json(allCohorts);
  } catch (error) {
    console.error("Error fetching students from database", error);
    response.status(500).json({ error, message: 'Something went wrong while fetching students' });
  }
});

app.post('/api/cohorts', async (request, response) => {
  console.log(request.body)
  const payload = request.body
  try {
    const newCohort = await Cohort.create(payload)
    response.status(201).json(newCohort)
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      response.status(400).json({ error, message: 'Duplicate somewhere' })
    } else {
      response.status(500).json({ error, message: 'Somethin happened maybe on the server' })
    }
  }
});

app.get('/api/cohorts/:cohortId', async (request, response) => {
  const { cohortId } = request.params
  const oneCohort = await Cohort.findById(cohortId)
  response.json(oneCohort)
});

app.put('/api/cohorts/:cohortId', async (request, response) => {
  console.log(request.body)
  const payload = request.body
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(request.params.cohortId, payload, { new: true })
    response.status(202).json(updatedCohort)
  } catch (error) {
    console.log(error)
    response.status(500).json({ message: 'Something bad happened' })
  }
});

app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    await Cohort.findByIdAndDelete(req.params.cohortId)
    res.status(204).json({message: 'The cohort was removed form the DB'})
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
});

app.use(errorHandler);
app.use(notFoundHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


