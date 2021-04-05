import { Schema, model } from 'mongoose';

const voteSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      unique: true
    },
    registerNumber: {
      type: Number,
      required: true,
      unique: true
    },
    otp: { type: Number },
    president: { type: String },
    vicePresident: { type: String },
    secretary: { type: String },
    youthRepresentative: { type: String },
    done: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

export default model('vote', voteSchema);
