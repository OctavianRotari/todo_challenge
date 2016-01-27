var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TodoSchema = new Schema({
  name: 'String',
  completed: 'Boolean',
  note: 'String',
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('todo', TodoSchema);
