import mongoose, { Schema, models, model } from 'mongoose';

const TaskSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Make sure we don't recompile in dev
const Task = models.Task || model('Task', TaskSchema);
export default Task;
