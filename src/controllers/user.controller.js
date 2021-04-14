import Logger from 'js-logger';
import Mongoose from 'mongoose';

import { User, validateUser } from 'models';

/**
 ** New User
 *
 * @route: /user/new
 * @method: POST
 * @requires: body { registerNumber, name, email, gender, department, phoneNumber, year, imageUrl }
 * @returns: 'Successfully registered' | 'Could not complete registration'
 */
export const newUser = async (req, res) => {
  const { body } = req;
  Logger.debug('Acknowledged: ', body);

  try {
    const { error } = validateUser(body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const lastOne = (await User.find({}).sort({ membershipNumber: -1 }).limit(1))[0];
    const membershipNumber = lastOne ? lastOne._doc.membershipNumber + 1 : 1;

    const theNewUser = new User({ ...body, membershipNumber });
    const userDocument = await theNewUser.save();

    Logger.debug('Registration successful.');
    return res.status(200).json({ message: 'Successfully registered', data: userDocument });
  } catch (err) {
    Logger.error(err);
    if (err.code === 11000) {
      const errorKeys = Object.keys(err.keyPattern);
      return res
        .status(400)
        .json({ message: `${body[errorKeys[0]]} is already registered`, error: err });
    }
    return res.status(500).json({ message: 'Could not complete registration', error: err });
  }
};

/**
 ** Get Users
 *
 * @route: /user/all
 * @method: GET
 * @requires: { auth }
 * @returns: list of registered students { id, registerNumber, name }
 */
export const getUsers = async (_req, res) => {
  try {
    const students = await User.find({}, { _id: 1, name: 1, registerNumber: 1 });
    return res.status(200).json({ message: 'Retrieved successfully', data: students });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Error retrieving data', error });
  }
};

/**
 ** Get User by ID
 *
 * @route: /user/id=:id
 * @method: GET
 * @requires: { auth }
 * @returns: registered student <User>
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: '"id" field required' });
  }

  try {
    if (!Mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: '"id" must be valid' });
    }

    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'User not exist' });
    }
    return res.status(200).json({ message: 'Retrieved successfully', data: student });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Error retrieving data', error });
  }
};

/**
 ** Get User by Register Number
 *
 * @route: /user?reg=:registerNumber
 * @method: GET
 * @requires: { auth }
 * @returns: registered student <User>
 */
export const getUserByRegisterNumber = async (req, res) => {
  const { registerNumber } = req.params;

  if (!registerNumber) {
    return res.status(400).json({ message: '"registerNumber" field required' });
  }

  try {
    if (!Number(registerNumber)) {
      return res.status(400).json({ message: '"registerNumber" must be valid' });
    }

    const student = await User.findOne({ registerNumber });
    if (!student) {
      return res.status(404).json({ message: 'User not exist' });
    }
    return res.status(200).json({ message: 'Retrieved successfully', data: student });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Error retrieving data', error });
  }
};

/**
 ** Get User by Email
 *
 * @route: /user?email=:email
 * @method: GET
 * @requires: { auth }
 * @returns: registered student <User>
 */
export const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: '"email" field required' });
  }

  try {
    const student = await User.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'User not exist' });
    }
    return res.status(200).json({ message: 'Retrieved successfully', data: student });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Error retrieving data', error });
  }
};

/**
 ** Get Detail as CSV
 *
 * @route: /getCSV
 * @method: POST
 * @requires: auth, body { type }
 * @returns: data in CSV format
 */
export const getCSV = async (req, res) => {
  const {
    body: { type }
  } = req;

  if (!type) {
    return res.status(400).json({ message: '"type" field required' });
  }

  try {
    const student = await User.find({}, { [type]: 1, _id: 0 });
    var csv = '';
    student.forEach(data => {
      if (!data[type]) return;
      csv += csv === '' ? data[type] : ',' + data[type];
    });
    return res.status(200).json({ message: 'Retrieved successfully', data: csv });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Error retrieving data', error });
  }
};
