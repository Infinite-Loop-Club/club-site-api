import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    registerNumber: {
      type: Number,
      min: 810000000000,
      max: 810025999999,
      required: true,
      unique: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    department: { type: String, required: true, default: 'CSE' },
    phoneNumber: { type: Number, min: 4444444444, max: 9999999999, required: true },
    year: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    membershipNumber: { type: Number, min: 1, max: 999999, unique: true, required: true }
  },
  {
    timestamps: true
  }
);

export default model('user', UserSchema);
