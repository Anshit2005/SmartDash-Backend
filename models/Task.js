const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true // auto adds createdAt and updatedAt
});

module.exports = mongoose.model('Task', taskSchema);
