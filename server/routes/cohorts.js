
const express = require('express');
const router = express.Router();
const Cohort = require('../models/Cohorts.model');
const { model } = require('mongoose');



  router.get('/static', (request, response) => {
    response.json(cohorts)
  });
  
  router.get('/', async (request, response) => {
    try {
      const allCohorts = await Cohort.find({});
      response.json(allCohorts);
    } catch (error) {
      console.error("Error fetching students from database", error);
      response.status(500).json({ error, message: 'Something went wrong while fetching students' });
    }
  });
  
  router.post('/', async (request, response) => {
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
        response.status(500).json({ error, message: 'Somethin hrouterened maybe on the server' })
      }
    }
  });
  
  router.get('/:cohortId', async (request, response) => {
    const { cohortId } = request.params
    const oneCohort = await Cohort.findById(cohortId)
    response.json(oneCohort)
  });
  
  router.put('/:cohortId', async (request, response) => {
    console.log(request.body)
    const payload = request.body
    try {
      const updatedCohort = await Cohort.findByIdAndUpdate(request.params.cohortId, payload, { new: true })
      response.status(202).json(updatedCohort)
    } catch (error) {
      console.log(error)
      response.status(500).json({ message: 'Something bad hrouterened' })
    }
  });
  
  router.delete("/:cohortId", async (req, res) => {
    try {
      await Cohort.findByIdAndDelete(req.params.cohortId)
      res.status(204).json({message: 'The cohort was removed form the DB'})
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
  });

  module.exports= router;