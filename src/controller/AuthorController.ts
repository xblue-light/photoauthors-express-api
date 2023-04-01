import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { User } from '../entity/User';
import { Author } from '../entity/Author';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class AuthorController {
  static newAuthor = async (req: Request, res: Response): Response<Author> => {
    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOneOrFail({
        relations: ['author', 'author.user', 'author.photos'],
        where: {
          id: req.user.userId,
        },
      });

      if (!user.author) {
        const newAuthor = new Author();
        newAuthor.name = req.body.author.name;
        user.author = newAuthor; // connect the one-to-one relationship with user and author
        await userRepository.save(user); // here its enough to save the user so we dont need to explicitly save the author since User#author has cascade
        res.status(201).json(user);
      } else {
        return res.status(404).json({
          error: {
            message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
          },
        });
      }
    } catch (err) {
      return res.status(401).json({
        error: {
          message: ERROR_MESSAGES.ACCESS_DENIED,
        },
      });
    }
  };

  static updateAuthorName = async (
    req: Request,
    res: Response,
  ): Response<Author> => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const { userId } = req.user;

      const user = await userRepository.findOneOrFail({
        relations: ['author', 'author.photos'],
        where: {
          id: userId,
        },
      });

      if (user.author) {
        user.author.name = req.body.author.name;
        await userRepository.save(user);
      }

      return res.status(201).json(user.author);
    } catch (error) {
      return res.status(401).json({
        error: {
          message: ERROR_MESSAGES.ACCESS_DENIED,
        },
      });
    }
  };
}
