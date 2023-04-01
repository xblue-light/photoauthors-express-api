import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { User } from '../entity/User';
import { validate } from 'class-validator';
import { Bcrypt } from '../utils/Bcrypt';
import { Author } from '../entity/Author';

export class UserController {
  static getAll = async (req: Request, res: Response): Response<User> => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find({
        relations: ['author'],
        select: ['id', 'username', 'role', 'author', 'createdAt', 'email'],
      });

      res.status(200).send(users);
    } catch (error) {}
  };

  static newUser = async (req: Request, res: Response): Response<User> => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const authorRepository = AppDataSource.getRepository(Author);
      let { username, password, email, role } = req.body;
      let user = new User();

      // if (!user.author) {
      //   const newAuthor = new Author();
      //   newAuthor.user = user;
      //   user.author = newAuthor;
      //   await authorRepository.save(newAuthor);
      // }

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
