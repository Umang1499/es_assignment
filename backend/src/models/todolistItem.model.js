const mongoose = require('mongoose');

const ToDoListItemSchema = new mongoose.Schema(
  {
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'todolist',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
    },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('todolist_items', ToDoListItemSchema);
