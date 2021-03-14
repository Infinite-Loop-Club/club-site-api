import { Schema, model } from 'mongoose';

const PostSchema = new Schema(
  {
    title: { type: String, minlength: 4, maxlength: 50, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'admin' }
  },
  {
    timestamps: true
  }
);

export default model('post', PostSchema);
