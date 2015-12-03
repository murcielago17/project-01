var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var PhotoSchema = new Schema({
  title: String,
  description: String,
  imageUrl: String,
  location: String,
  comments:[{
		type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]

});

var Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;