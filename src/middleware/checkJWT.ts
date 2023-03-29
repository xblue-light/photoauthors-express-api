import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import moment = require("moment");
import { ACCESS_TOKEN_SECRET } from "../../config";

export const checkJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json(
        { 
            error: {
                message: 'Missing authorization token' 
            }
        }
    );
  }

  try {
      console.log("Attempting to verify the signature of the JWT...");
      jwt.verify(token, ACCESS_TOKEN_SECRET, (err: Error, decodedJWT: JwtPayload) => {

        if(err) {
            console.log("The JWT could not be verified!");
            res.status(401).send({ error: err });
        }
        else {

            console.log("Successfully decoded JWT token...");
            console.log("Decoded JWT:", decodedJWT);

            // Check if token is about to expire
            const nowInUnixTimestamp = Math.floor(Date.now() / 1000);
            const tokenExpiryDateInUnix = decodedJWT.exp;
            const timeUntilTokenExpires = tokenExpiryDateInUnix - nowInUnixTimestamp;
            const TIME_TO_EXPIRE_SECONDS = 120;
            
            console.log("Check if token is about to expire...");
            if (timeUntilTokenExpires < TIME_TO_EXPIRE_SECONDS) { // Less than 2 minute left
                console.log(`JWT has less than ${TIME_TO_EXPIRE_SECONDS} seconds left until it expires!`);
            //   const newToken = jwt.sign({ /* Your payload here */ }, process.env.JWT_SECRET, { expiresIn: '15m' }); // Generate new token with 15 minute expiration time
            //   res.set('Authorization', newToken); // Set the new token in the response header
            }
            else {
                console.log("Token has not expired yet...")
            }
     
            // The reason we set the req.user here is that in the next request handler i.e we will have access to the user in our controllers.
            req.user = decodedJWT;
            res.locals.jwtPayload = decodedJWT;
        }
    })
    console.log("Next...")
    return next();

  } catch (err) {
    console.log("Verifying JWT has failed!");
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
}
