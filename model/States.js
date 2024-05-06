const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stateSchema = new Schema({
  stateCode: {
    type: String,
    required: true
  },
  funfacts: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model("States", stateSchema);
