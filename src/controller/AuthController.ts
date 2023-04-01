import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { Bcrypt } from '../utils/Bcrypt';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
} from '../../config';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class AuthController {
  static login = async (req: Request, res: Response) => {
    try {
      // Check if username and password are set
      let { username, password } = req.body;

      if (!(username && password)) {
        return res.status(401).json({
          error: {
            message: ERROR_MESSAGES.INVALID_CREDS,
          },
        });
      }

      let user: User;
      const userRepository = AppDataSource.getRepository(User);

      // Get user from database
      user = await userRepository.findOne({
        where: {
          username,
        },
      });

      if (!user) {
        return res.status(401).json({
          error: {
            message: ERROR_MESSAGES.ACCESS_DENIED,
          },
        });
      }

      // Validate if the hashed password and plain password from req.body match
      const isPasswordValid = await Bcrypt.isPasswordValid(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          error: {
            message: ERROR_MESSAGES.INVALID_CREDS,
          },
        });
      }

      // Sign JWT, valid for 1 hour
      const accessToken = jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
        },
      );

      // json the JWT in the response
      return res.status(200).json({
        accessToken,
      });
    } catch (error) {
      return res.status(401).json({
        error: {
          message: ERROR_MESSAGES.ACCESS_DENIED,
        },
      });
    }
  };

  static changePassword = async (req: Request, res: Response) => {
    try {
      // Get parameters from the body
      const { oldPassword, newPassword, username } = req.body;

      if (!(oldPassword && newPassword)) {
        res.status(401).json({
          error: {
            message: ERROR_MESSAGES.INVALID_CREDS,
          },
        });
        return;
      }

      // Get user from the database
      const userRepository = AppDataSource.getRepository(User);
      let user: User;

      user = await userRepository.findOneOrFail({
        where: {
          username,
        },
      });

      // Validate if the hashed password and plain password from req.body match
      const isPasswordValid = await Bcrypt.isPasswordValid(
        oldPassword,
        user.password,
      );

      if (!isPasswordValid) {
        res.status(401).json({
          error: {
            message: ERROR_MESSAGES.INVALID_CREDS,
          },
        });

        return;
      }

      // Hash the new password and save
      const newHashedPassword = await Bcrypt.hashPassword(newPassword);
      user.password = newHashedPassword;
      console.log('Saving new user password.');
      await userRepository.save(user);

      res.status(200).json(user);
    } catch (error) {
      res.status(401).json({
        error: {
          message: ERROR_MESSAGES.ACCESS_DENIED,
        },
      });
    }
  };
}
export default AuthController;
