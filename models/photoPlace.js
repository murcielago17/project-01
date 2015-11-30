var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PhotoPlaceSchema = new Schema({
  title: String,
  description: String
});

var PhotoPlace = mongoose.model('PhotoPlace', PhotoPlaceSchema);

module.exports = PhotoPlace;