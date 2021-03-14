import Logger from 'js-logger';

import { Post } from '../models';

export const newPost = async (req, res) => {
  const { body } = req;
  Logger.debug('Acknowledged: ', body);
  const theNewPost = new Post(body);

  try {
    const postDocument = await theNewPost.save();
    Logger.debug('Post created successfully.');
    return res.status(200).json({ message: 'Successfully posted', data: postDocument });
  } catch (err) {
    Logger.debug(err);
    return res.status(500).json({ message: 'Could not create post', error: err });
  }
};
