import Logger from 'js-logger';
import Mongoose from 'mongoose';

import { Post, validatePost } from 'models';

/**
 ** New Post
 *
 * @route: /post/new
 * @method: POST
 * @requires: body { title, content, description ,author?, attachment? }
 * @returns: 'Successfully posted' | 'Could not create post'
 */
export const newPost = async (req, res) => {
  const { body } = req;
  Logger.debug('Acknowledged: ', body);

  const { error } = validatePost(body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const theNewPost = new Post(body);
    const postDocument = await theNewPost.save();
    Logger.debug('Post created successfully.');
    return res.status(200).json({ message: 'Successfully posted', data: postDocument });
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ message: 'Could not create post', error: err });
  }
};

/**
 ** Get all Post
 *
 * @route: /post/all
 * @method: GET
 * @requires: {}
 * @returns: 'All posts' | 'Error retrieving posts'
 */
export const getPosts = async (_req, res) => {
  try {
    const posts = await Post.find({}, { __v: 0 });
    return res.status(200).json({ message: 'All posts', data: posts });
  } catch (error) {
    Logger.error('Error retrieving posts', error);
    return res.status(500).json({ message: 'Error retrieving posts', error });
  }
};

/**
 ** Get Post
 *
 * @route: /post/:id
 * @method: GET
 * @requires: params: {id}
 * @returns: 'Post retrieved' | 'Error retrieving post'
 */
export const getPostById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: '"id" field required' });
  }

  try {
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: '"id" must be valid' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not exist' });
    }
    return res.status(200).json({ message: 'Post retrieved', data: post });
  } catch (error) {
    Logger.error('Error retrieving post', error);
    return res.status(400).json({ message: 'Error retrieving post', error });
  }
};

/**
 ** Delete Post
 *
 * @route: /post/delete
 * @method: DELETE
 * @requires: body { id }
 * @returns: 'Successfully deleted' | 'Could not delete post'
 */
export const deletePost = async (req, res) => {
  const {
    body: { id }
  } = req;
  Logger.debug('Acknowledged: ', id);

  if (!id) {
    return res.status(400).json({ message: '"id" field required' });
  }

  try {
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: '"id" must be valid' });
    }

    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not exist' });
    }
    Logger.debug('Post deleted successfully.');
    return res.status(200).json({ message: 'Successfully deleted' });
  } catch (err) {
    Logger.error(err);
    return res.status(400).json({ message: 'Could not delete post', error: err });
  }
};
