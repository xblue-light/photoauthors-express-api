import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
} from '../../config';
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
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    res.status(401).send({
      error: {
        message: ERROR_MESSAGES.ACCESS_DENIED,
      },
    });
  }

  try {
    const decodedJWT = jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET,
    ) as JwtPayload;
    const { userId, username } = decodedJWT;

    if (decodedJWT.exp && decodedJWT.exp - Date.now() / 1000 < 60) {
      let signNewJWT;
      logger.info('Token is about to expire.. generating/signing a new token!');

      if (!signNewJWT) {
        logger.info('Signing new token...');
        // Sign new JWT
        signNewJWT = jwt.sign(
          {
            userId,
            username,
          },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: '15m',
          },
        );
        // Send in response header the newly generated token
        res.setHeader('X-Authorization', signNewJWT);
      }
    }
    req.user = decodedJWT;
    next(); // Call the next middleware or controller
  } catch (err) {
    logger.info(err);
    res.status(401).json({
      error: {
        message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
      },
    });
  }
};
