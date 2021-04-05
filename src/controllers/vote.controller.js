import Logger from 'js-logger';
import mongoose from 'mongoose';
import transporter from 'MailConnection';
import jwt from 'jsonwebtoken';

import { User, Vote } from 'models';

/**
 ** Get OTP
 *
 * @route: /vote/sendOtp
 * @method: Post
 * @requires: { registerNumber }
 */
export const sendVoteOTP = async (req, res) => {
  const { registerNumber } = req.body;

  if (!registerNumber) {
    return res.status(400).json({ message: 'Register number is required!' });
  }

  try {
    const student = await User.findOne({ registerNumber });

    if (!student) {
      return res.status(401).json({ message: 'You are not a member of ILC!' });
    }

    const vote = await Vote.findOne({ id: student._id });
    const otp = Math.floor(100000 + Math.random() * 900000);
    if (vote) {
      if (vote._doc.done) {
        return res.status(401).json({ message: 'You have already casted your vote!' });
      } else {
        vote.otp = otp;
        await vote.save();
      }
    } else {
      const newVote = new Vote({
        id: student._doc._id,
        registerNumber: student._doc.registerNumber,
        otp
      });
      await newVote.save();
    }

    let mailOptions = {
      from: '"Infinite Loop Club" infiniteloopclub.noreply@gmail.com',
      to: student._doc.email,
      subject: 'OTP for Voting',
      html: `
          <h3>Your OTP for voting is:</h3>
		      <h1>${otp}</h1>
          <br />
          <p>If you don't know why you're getting this email, please report to 'infiniteloopclub.noreply@gmail.com'</p>
        `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      return res.status(500).json({ message: 'Error sending OTP! Please try again later.' });
    }

    return res.status(200).json({
      done: true,
      message: 'OTP sent successfully',
      userID: student._doc._id
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Error retrieving data', error });
  }
};

/**
 ** verify OTP
 *
 * @route: /vote/verifyOtp
 * @method: Post
 * @requires: { userID,OTP }
 */
export const verifyOTP = async (req, res) => {
  const { userID, otp } = req.body;

  if (!userID || !otp) {
    return res.status(400).json({ message: 'Both the fields are mandatory!' });
  }

  try {
    const vote = await Vote.findOne({
      id: mongoose.Types.ObjectId(userID),
      otp
    });

    if (vote) {
      if (vote._doc.done) {
        return res.status(401).json({ message: 'You have already casted your vote!' });
      } else {
        const token = await jwt.sign(
          {
            data: {
              id: vote._doc.id,
              registerNumber: vote._doc.registerNumber
            }
          },
          process.env.JWT_SECRET,
          { expiresIn: '.25h' }
        );
        return res.status(200).json({ done: true, message: 'OTP Verified', token });
      }
    } else {
      return res.status(401).json({ message: 'Invalid OTP!' });
    }
  } catch (error) {
    Logger.error(error.message);
    if (!error.code) {
      return res.status(500).json({ message: 'Invalid User!' });
    }
    return res.status(500).json({ message: 'Error retrieving data', error });
  }
};

/**
 ** make vote
 *
 * @route: /vote/make
 * @method: Post
 * @requires: { token, president, vicePresident, secretary, youthRepresentative}
 */

export const makeVote = async (req, res) => {
  const { token, president, vicePresident, secretary, youthRepresentative } = req.body;

  if (!token || !president || !vicePresident || !secretary || !youthRepresentative) {
    return res.status(400).json({ message: 'Both the fields are mandatory!' });
  }

  try {
    const { data } = jwt.verify(token, process.env.JWT_SECRET);
    const vote = await Vote.findOne({
      id: mongoose.Types.ObjectId(data.id)
    });

    if (vote) {
      if (vote._doc.done) {
        return res.status(401).json({ message: 'You have already casted your vote!' });
      } else {
        vote.done = true;
        vote.president = president;
        vote.vicePresident = vicePresident;
        vote.secretary = secretary;
        vote.youthRepresentative = youthRepresentative;
        await vote.save();
        return res.status(200).json({ done: true, message: 'Vote casted successfully' });
      }
    } else {
      return res.status(500).json({ message: 'Invalid User!' });
    }
  } catch (error) {
    Logger.error(error.message);
    if (error.message === 'jwt expired') {
      return res.status(500).json({ message: 'Request Timeout ! please try again later' });
    } else if (!error.code) {
      return res.status(500).json({ message: 'Invalid User!' });
    }
    return res.status(500).json({ message: 'Error retrieving data', error });
  }
};
