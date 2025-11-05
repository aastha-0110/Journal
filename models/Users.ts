import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    themePreference: {
      mode: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      accentColor: {
        type: String,
        default: '#3b82f6', // blue-500
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model('User', UserSchema);

export default User;