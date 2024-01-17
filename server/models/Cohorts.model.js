const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// CREATE A SCHEMA
const cohortsSchema = new Schema({

  inProgress: { Boolean },
  cohortSlug: { type: String, required:true },
  cohortName: { type: String,  required:true},
  program: { type: String,  required:true},
  campus: { type: String,required:true},
  startDate: {type: Date, required:true},
  endDate: {type: Date, required:true },
  programManager: {type:String,required:true},
  leadTeacher: {type:String, required:true},
  totalHours: {type:Number, required:true}
});

// CREATE A MODEL
const Cohorts = mongoose.model("Cohorts", cohortsSchema);

// EXPORT THE MODEL
module.exports = Cohorts;




