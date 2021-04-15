import request from 'supertest';
import { User } from 'models';
import { userArray } from './constants/user';

let server;

describe('/user/', () => {
  beforeEach(() => {
    server = require('../../../server');
  });
  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  describe('POST /new', () => {
    let payload;

    const exec = async () => {
      return await request(server).post('/user/new').send(payload);
    };

    it('should return 400 if some key is not passed', async () => {
      payload = {
        ...userArray[0]
      };
      delete payload.name;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is already registered', async () => {
      const user = new User({
        ...userArray[0]
      });
      await user.save();

      payload = {
        ...userArray[0],
        registerNumber: 810018104080
      };
      delete payload.membershipNumber;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if register no is already registered', async () => {
      const user = new User({
        ...userArray[0]
      });
      await user.save();

      payload = {
        ...userArray[0],
        email: 'some@gmail.com'
      };
      delete payload.membershipNumber;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the user if it is valid', async () => {
      payload = {
        ...userArray[0]
      };
      delete payload.membershipNumber;
      const res = await exec();
      const user = await User.find({ registerNumber: userArray[0].registerNumber });

      expect(res.status).toBe(200);
      expect(user).not.toBeNull();
    });

    it('should return the user', async () => {
      payload = {
        ...userArray[0]
      };
      delete payload.membershipNumber;
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('registerNumber', userArray[0].registerNumber);
    });
  });

  describe('GET /all', () => {
    let token;

    const exec = async () => {
      return await request(server).get('/user/all').set('Authorization', token);
    };

    beforeEach(() => {
      token = 'bearer ' + 'W5NIc1w17dqP2FX5kjd3';
    });

    it('should return 401 if unauthorized', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return all user', async () => {
      await User.collection.insertMany(userArray);

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(userArray.length);
      expect(
        res.body.data.some(u => u.registerNumber === userArray[0].registerNumber)
      ).toBeTruthy();
      expect(
        res.body.data.some(u => u.registerNumber === userArray[1].registerNumber)
      ).toBeTruthy();
    });
  });

  describe('GET /id=:id', () => {
    let token;
    let id;

    const exec = async () => {
      return await request(server).get(`/user/id=${id}`).set('Authorization', token);
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

    it('should return 404 if user not exits', async () => {
      id = '6075b982f3fc702a302dbf31';
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return user by id', async () => {
      const user = new User({
        ...userArray[0]
      });
      await user.save();

      id = user._id;
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('_id');
    });
  });

  describe('GET /reg=:registerNumber', () => {
    let token;
    let registerNumber;

    const exec = async () => {
      return await request(server).get(`/user/reg=${registerNumber}`).set('Authorization', token);
    };

    beforeEach(() => {
      token = 'bearer ' + 'W5NIc1w17dqP2FX5kjd3';
    });

    it('should return 401 if unauthorized', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if register number not passed', async () => {
      registerNumber = 0;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if register number is invalid', async () => {
      registerNumber = 'something';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if user not exits', async () => {
      registerNumber = '810018104080';
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return user by register number', async () => {
      const user = new User({
        ...userArray[0]
      });
      await user.save();

      registerNumber = userArray[0].registerNumber;
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('registerNumber', userArray[0].registerNumber);
    });
  });

  describe('GET /email=:email', () => {
    let token;
    let email;

    const exec = async () => {
      return await request(server).get(`/user/email=${email}`).set('Authorization', token);
    };

    beforeEach(() => {
      token = 'bearer ' + 'W5NIc1w17dqP2FX5kjd3';
    });

    it('should return 401 if unauthorized', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 404 if user not exits', async () => {
      email = 'santhoshtest@gmail.com';
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return user by email', async () => {
      const user = new User({
        ...userArray[0]
      });
      await user.save();

      email = userArray[0].email;
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('email', userArray[0].email);
    });
  });

  describe('POST /getCSV', () => {
    let token;
    let type;

    const exec = async () => {
      return await request(server).post('/user/getCSV').set('Authorization', token).send({ type });
    };

    beforeEach(() => {
      token = 'bearer ' + 'W5NIc1w17dqP2FX5kjd3';
    });

    it('should return 401 if unauthorized', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if type not passed', async () => {
      type = undefined;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return CSV by type', async () => {
      const user = new User({
        ...userArray[0]
      });
      await user.save();

      type = 'name';
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.data).toBe(userArray[0].name);
    });
  });
});
