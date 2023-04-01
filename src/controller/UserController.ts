import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { User } from '../entity/User';
import { validate } from 'class-validator';
import { Bcrypt } from '../utils/Bcrypt';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class UserController {
  static getAll = async (req: Request, res: Response): Response<User> => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find({
        relations: ['author'],
        select: ['id', 'username', 'role', 'author', 'createdAt', 'email'],
      });

      return res.status(200).json(users);
    } catch (error) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.REQUEST_NOT_FOUND });
    }
  };

  static newUser = async (req: Request, res: Response): Response<User> => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      let { username, password, email, role } = req.body;
      let user = new User();

      user.username = username;
      user.email = email;

      const hashedPassword = await Bcrypt.hashPassword(password);
      user.password = hashedPassword;
      user.role = role;

      // Validate if the params are OK
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).json(errors);
      }

      await userRepository.save(user);
      return res.json(user);
    } catch (error) {
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.REQUEST_NOT_FOUND });
    }
  };
}
