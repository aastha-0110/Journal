import mongoose, { Schema, model, models } from 'mongoose';

const EntrySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    mood: {
      type: String,
      enum: ['happy', 'good', 'okay', 'sad', 'anxious'],
      required: [true, 'Mood is required'],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
EntrySchema.index({ userId: 1, date: -1 });

const Entry = models.Entry || model('Entry', EntrySchema);

export default Entry;