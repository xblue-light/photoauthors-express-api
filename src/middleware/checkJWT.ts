import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../../config';
import * as winston from 'winston';
import { ERROR_MESSAGES } from '../utils/errorMessages';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {
    service: 'authentication',
  },
  transports: [new winston.transports.Console()],
});

export const checkJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({
      error: {
        message: ERROR_MESSAGES.ACCESS_DENIED,
      },
    });
  }

  try {
    const decodedJWT = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    if (decodedJWT.exp && decodedJWT.exp - Date.now() / 1000 < 60) {
      // If the token has only 60 seconds left
      logger.info('Token is about to expire generate a new token!');
      // TODO
    }
    req.user = decodedJWT;
    next(); // Call the next middleware or controller
  } catch (err) {
    logger.info(err);
    return res.status(401).send({
      error: {
        message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
      },
    });
  }
};
