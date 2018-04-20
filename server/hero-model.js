const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const heroSchema = new Schema(
  {
    id: String,
    name: String,
    saying: String    
  },
  { autoIndex: false }
);

const Hero = mongoose.model('Hero', heroSchema);
module.exports = Hero;