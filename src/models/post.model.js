import { Schema, model } from 'mongoose';

const PostSchema = new Schema(
  {
    title: { type: String, minlength: 4, maxlength: 50, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'admin' },
    attachment: { type: String }
  },
  {
    timestamps: true
  }
);

export default model('post', PostSchema);
