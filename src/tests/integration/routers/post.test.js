import request from 'supertest';
import { Post } from 'models';
import { postArray } from './constants/post';

let server;

describe('/post/', () => {
  beforeEach(() => {
    server = require('../../../server');
  });

  afterEach(async () => {
    await Post.deleteMany({});
    await server.close();
  });

  describe('POST /new', () => {
    let payload;
    let token;

    const exec = async () => {
      return await request(server).post('/post/new').set('Authorization', token).send(payload);
    };

    beforeEach(() => {
      token = 'bearer ' + 'W5NIc1w17dqP2FX5kjd3';
    });

    it('should return 401 if unauthorized', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if some key is not passed', async () => {
      payload = {
        ...postArray[0]
      };
      delete payload.title;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the post if it is valid', async () => {
      payload = {
        ...postArray[0]
      };
      const res = await exec();
      const post = await Post.find({ name: postArray[0].name });

      expect(res.status).toBe(200);
      expect(post).not.toBeNull();
    });

    it('should return the post', async () => {
      payload = {
        ...postArray[0]
      };
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('title', postArray[0].title);
    });
  });

  describe('GET /all', () => {
    const exec = async () => {
      return await request(server).get('/post/all');
    };

    it('should return all post', async () => {
      await Post.collection.insertMany(postArray);

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(postArray.length);
      expect(res.body.data.some(p => p.title === postArray[0].title)).toBeTruthy();
      expect(res.body.data.some(p => p.title === postArray[1].title)).toBeTruthy();
    });
  });

  describe('GET /id=:id', () => {
    let id;

    const exec = async () => {
      return await request(server).get(`/post/${id}`);
    };

    it('should return 400 if id not passed', async () => {
      id = undefined;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if id is invalid', async () => {
      id = 'something';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if post not exits', async () => {
      id = '6075b982f3fc702a302dbf31';
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return post by id', async () => {
      const post = new Post({
        ...postArray[0]
      });
      await post.save();

      id = post._id;
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('_id');
    });
  });

  describe('DELETE /all', () => {
    let token;
    let id;

    const exec = async () => {
      return await request(server).delete('/post/delete').set('Authorization', token).send({ id });
    };

    beforeEach(() => {
      token = 'bearer ' + 'W5NIc1w17dqP2FX5kjd3';
    });

    it('should return 401 if unauthorized', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if id not passed', async () => {
      id = undefined;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if id is invalid', async () => {
      id = 'something';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if post not exits', async () => {
      id = '6075b982f3fc702a302dbf31';
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete post by id', async () => {
      const post = new Post({
        ...postArray[0]
      });
      await post.save();

      id = post._id;
      const res = await exec();

      const findPost = await Post.findById(post._id);

      expect(res.status).toBe(200);
      expect(findPost).toBeNull();
    });
  });
});
