const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodosSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },

    message: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    attention: {
      type: Boolean
    },
    date: {
      type: Date,
      default: Date.now
      }

})

module.exports = Todo = mongoose.model('todo', TodosSchema);