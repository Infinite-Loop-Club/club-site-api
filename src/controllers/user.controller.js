import Logger from 'js-logger';

import { User } from '../models';

/**
 ** New User
 *
 * @route: /user/new
 * @method: POST
 * @requires: body { registerNumber, name, email, phoneNumber, year }
 * @returns: 'Successfully registered' | 'Could not complete registration'
 */
export const newUser = async (req, res) => {
  const { body } = req;
  Logger.debug('Acknowledged: ', body);
  const mandatoryFields = ['name', 'registerNumber', 'email', 'phoneNumber', 'year'];

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
