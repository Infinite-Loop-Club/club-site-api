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
  const theNewUser = new User(body);

  try {
    const userDocument = await theNewUser.save();
    Logger.debug('Registration successfully.');
    return res.status(200).json({ message: 'Successfully registered', data: userDocument });
  } catch (err) {
    Logger.debug(err);
    return res.status(400).json({ message: 'Could not complete registration', error: err });
  }
};
