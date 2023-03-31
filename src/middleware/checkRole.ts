import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let user: User;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const userId = req.user.userId; // Get the user ID from previous midleware
      user = await userRepository.findOneOrFail({
        where: {
          id: userId,
        },
      });
    } catch (err) {
      res.status(401).send({
        error: {
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        },
      });
    }

    // If the user.role contains the required permission then proceed
    if (roles.indexOf(user.role.trim()) > -1) {
      next();
    } else {
      res.status(401).send({
        error: {
          message: ERROR_MESSAGES.PERMISSION_ERROR,
        },
      });
    }
  };
};
