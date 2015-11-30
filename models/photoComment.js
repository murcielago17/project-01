var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PhotoCommentSchema = new Schema({
  title: String,
  description: String
});

var PhotoComment = mongoose.model('PhotoComment', PhotoCommentSchema);

module.exports = PhotoComment;