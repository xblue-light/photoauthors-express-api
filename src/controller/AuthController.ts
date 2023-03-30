import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { Bcrypt } from '../utils/Bcrypt';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
} from '../../config';
import { validate } from 'class-validator';

export class AuthController {
  static login = async (req: Request, res: Response) => {
    try {
      // Check if username and password are set
      let { username, password } = req.body;

      if (!(username && password)) {
        res.sendStatus(400);
      }

      // Get user from database
      const userRepository = AppDataSource.getRepository(User);
      let user: User;

      user = await userRepository.findOne({
        where: {
          username,
        },
      });

      if (!user) {
        throw new Error('User not found!');
      }

      // Validate if the hashed password and plain password from req.body match
      const isPasswordValid = await Bcrypt.isPasswordValid(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        return res.status(401).send({ error: 'The password is not valid!' });
      }

      // Sign JWT, valid for 1 hour
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
        },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
        },
      );

      // Send the jwt in the response
      res.send(token);
    } catch (error) {
      res.status(401).send({
        error: error,
      });
    }
  };

  static changePassword = async (req: Request, res: Response) => {
    try {
      // Get ID from JWT

      // Get parameters from the body
      const { oldPassword, newPassword, username } = req.body;

      if (!(oldPassword && newPassword)) {
        res.status(400).send('Please provide oldPassword and newPassword');
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

      if (user) {
        console.log('user found:', user);
      }

      // Validate if the hashed password and plain password from req.body match
      const isPasswordValid = await Bcrypt.isPasswordValid(
        oldPassword,
        user.password,
      );

      if (!isPasswordValid) {
        return res.status(401).send({ error: 'The password is not valid!' });
      }

      // Hash the new password and save
      user.password = await Bcrypt.hashPassword(newPassword);

      // Validate model
      const errors = await validate(user);

      if (errors.length > 0) {
        console.log('An error occured in the class-validator!');
        res.status(400).send(errors);
        return;
      }

      console.log('Saving user:', user);
      userRepository.save(user);

      res.status(200).send(user);
    } catch (error) {
      return res
        .status(404)
        .send('Error: something went wrong @112 AuthController');
    }
  };
}
export default AuthController;
