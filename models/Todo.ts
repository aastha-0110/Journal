import mongoose, { Schema, model, models } from 'mongoose';

const TodoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Todo text is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
TodoSchema.index({ userId: 1, completed: 1 });

const Todo = models.Todo || model('Todo', TodoSchema);

export default Todo;