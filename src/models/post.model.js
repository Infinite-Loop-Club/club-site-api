import { Schema, model } from 'mongoose';
import Joi from 'joi';

const PostSchema = new Schema(
  {
    title: { type: String, minlength: 4, maxlength: 50, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true, default: 'admin' },
    attachment: { type: String }
  },
  {
    timestamps: true
  }
);

export default model('post', PostSchema);

export const validatePost = data => {
  const schema = Joi.object({
    title: Joi.string().min(4).max(50).required(),
    description: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
    attachment: Joi.string()
  });

  return schema.validate(data);
};
