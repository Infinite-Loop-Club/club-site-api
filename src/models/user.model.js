import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    registerNumber: {
      type: String,
      minlength: 12,
      maxlength: 12,
      required: true,
      unique: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, min: 4444444444, max: 9999999999, required: true },
    year: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

export default model('user', UserSchema);
