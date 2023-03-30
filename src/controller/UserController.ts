import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';
import { validate } from 'class-validator';
import { Bcrypt } from '../utils/Bcrypt';

export class UserController {
  static getAll = async (req: Request, res: Response): Response<User> => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find({
        select: ['id', 'username', 'role'],
      });

      res.status(200).send(users);
    } catch (error) {}
  };

  static newUser = async (req: Request, res: Response): Response<User> => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      let { username, password, email, role } = req.body;
      let user = new User();
      user.username = username;
      user.email = email;
      user.password = await Bcrypt.hashPassword(password);
      user.role = role;

      // Validate if the params are OK
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).send(errors);
      }
      await userRepository.save(user);
      return res.json(user);
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  };
}
