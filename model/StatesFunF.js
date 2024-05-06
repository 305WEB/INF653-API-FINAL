const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stateSchema = new Schema({
  stateCode: {
    type: String,
    required: true
  },
  index: {
    type: [Number],
    required: true
  }
});

module.exports = mongoose.model("StatesFunF", stateSchema);
