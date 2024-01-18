const express = require('express');
const router = express.Router();
const Student = require('../models/Students.model');

router.get('/static', (request, response) => {
  response.json(students);
});

router.get('/', async (request, response) => {
    try {
        const allStudents = await Student.find().populate('cohort');
        response.json(allStudents);
      } catch (error) {
        console.error("Error fetching students from database", error);
        response.status(500).json({ error, message: 'Something went wrong while fetching students' });
      }
});

router.post('/', async (request, response) => {
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
});

router.get('/cohort/:cohortId', async (request, response) => {
    const { cohortId } = request.params;
    try {
      const studentsInCohort = await Student.find({ cohort: cohortId }).populate('cohort');
      response.json(studentsInCohort);
    } catch (error) {
      console.error("Error fetching students from database", error);
      response.status(500).json({ error, message: 'Something went wrong while fetching students in cohort' });
    }
  });

  router.get('/:studentId', async (request, response) => {
    const { studentId } = request.params;
    try {
      const oneStudent = await Student.findById(studentId).populate('cohort');
      response.json(oneStudent);
    } catch (error) {
        console.error("Error fetching student from database", error);
        response.status(500).json({ error, message: 'Something went wrong while fetching student' });
    }
  });

  router.put('/:studentId', async (request, response) => {
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
  
  router.delete("/:studentId", async (req, res) => {
    try {
      await Student.findByIdAndDelete(req.params.studentId)
      res.status(204).json({message: 'The student was removed from the DB'})
  
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  });



module.exports = router;
