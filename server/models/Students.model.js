const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentsSchema = new Schema({
  firstName: { type:String, required:true},
  lastName: { type: String, required:true },
  email: { type: String, required:true},
  phone: { type: String, required:true},
  linkedinUrl: { type: String, required:true},
  languages: {type: [String], required:true},
  program: {type: String, required:true},
  background: {type:String,required:true},
  image: {type:String, required:true},
  cohort: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Cohorts', 
    required: true,},
  projects: {type:Array,required:true}
});

const Students = mongoose.model("Students", studentsSchema);

module.exports = Students;








