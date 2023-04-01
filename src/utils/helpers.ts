import { ValidatorOptions, validate } from 'class-validator';
import { JwtPayload } from 'jsonwebtoken';
import moment = require('moment');

export const isTokenExpired = (decodedToken: JwtPayload): boolean => {
  if (moment().isAfter(decodedToken.exp)) {
    // The isAfter() method checks if the current time (i.e., moment()) is after the expiryDate of the refreshToken
    // If it is, then the token has expired, and the method returns true
    console.log(
      'The current time is after the expiry date. The refresh token is NOT valid!',
    );
    return true;
  } else {
    // Otherwise, if the current time is before the expiryDate,
    // then the method returns false, indicating that the token is still valid.
    console.log(
      'The current time is before expiry date. The refresh token is still valid!',
    );
    return false;
  }
};

// Here's an example code snippet that shows how to format the current time as a Unix timestamp using Moment.js:
//const unixTimestamp = moment().format("X");
//console.log(unixTimestamp); // Output: 1680078334 (this value will change every second)

export const isModelValid = async (
  targetModel: object,
  validatorOptions?: ValidatorOptions,
) => {
  // Validate model
  const errors = await validate(targetModel);

  if (errors.length > 0) {
    console.log('An error occured in the class-validator!');
    return false;
  }

  console.log('Object model has been validated!');
  return true;
};
