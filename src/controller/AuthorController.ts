import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { User } from '../entity/User';
import { Author } from '../entity/Author';

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
        console.log('Creating new author...');
        const newAuthor = new Author();
        newAuthor.name = req.body.author.name;
        user.author = newAuthor; // connect the one-to-one relationship with user and author
        await userRepository.save(user); // here its enough to save the user so we dont need to explicitly save the author since User#author has cascade
        return res.status(201).send(user);
      } else {
        return res.status(404).send('user author exists already');
      }
    } catch (error) {
      return res.status(404).send(error);
    }
  };

  static updateAuthorName = async (
    req: Request,
    res: Response,
  ): Response<Author> => {
    console.log(req.user);
    const userRepository = AppDataSource.getRepository(User);
    const { userId } = req.user;

    const user = await userRepository.findOneOrFail({
      relations: ['author', 'author.photos'],
      where: {
        id: userId,
      },
    });

    console.log('user.author before:', user.author);

    if (user.author) {
      console.log('Updating author name...');
      user.author.name = req.body.author.name;
      console.log('user.author after:', user.author);
      await userRepository.save(user);
    }

    return res.status(201).send(user.author);
  };
}
