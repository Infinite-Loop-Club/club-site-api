import Logger from 'js-logger';

import { User } from '../models';

/**
 ** New User
 *
 * @route: /user/new
 * @method: POST
 * @requires: body { registerNumber, name, email, phoneNumber, year, imageUrl }
 * @returns: 'Successfully registered' | 'Could not complete registration'
 */
export const newUser = async (req, res) => {
  const { body } = req;
  Logger.debug('Acknowledged: ', body);
  const mandatoryFields = ['name', 'registerNumber', 'email', 'phoneNumber', 'year', 'imageUrl'];

  try {
    for (const mandatoryField of mandatoryFields) {
      if (!body[mandatoryField]) {
        return res.status(400).json({
          message: `Validation Error: '${mandatoryField}' is required`,
          error: {
            name: 'ValidationError',
            keyPattern: {
              [mandatoryField]: 1
            },
            keyValue: {
              [mandatoryField]: String(body[mandatoryField])
            }
          }
        });
      }
    }
    const theNewUser = new User(body);
    const userDocument = await theNewUser.save();
    Logger.debug('Registration successful.');
    return res.status(200).json({ message: 'Successfully registered', data: userDocument });
  } catch (err) {
    Logger.debug(err);
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
 * @route: /user?id=:id
 * @method: GET
 * @requires: { auth }
 * @returns: registered student <User>
 */
export const getUserById = async (req, res) => {
  console.log('dcnk');
  const { id } = req.params;
  try {
    const student = await User.findById(id);
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
  try {
    const student = await User.findOne({ registerNumber });
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
  try {
    const student = await User.findOne({ email });
    return res.status(200).json({ message: 'Retrieved successfully', data: student });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Error retrieving data', error });
  }
};
