const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
  title: {type: String, required: true},
  body: String,
});

NoteSchema.methods.truncateBody = function() {
  if (this.body && this.body.length > 75) {
    return this.body.substring(0, 70) + '...';
  }

  return this.body
};

const Note = mongoose.model('Note', NoteSchema)

module.exports = Note;

