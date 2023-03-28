import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { PasswordHash } from "../utils/PasswordHash";
//import config from "../config/config";

export class AuthController {

    private static ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-512-bit-secret";
    private static ACCESS_TOKEN_EXPIRATION_TIME = '1h'; // 1 hour
    private static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret_value";
    private static REFRESH_TOKEN_EXPIRATION_TIME = '1d'; // 1 day

    static login = async (req: Request, res: Response) => {
        try {
            // Check if username and password are set
            let { username, password } = req.body;
            if (!(username && password)) {
                res.sendStatus(400);
            }
    
            // Get user from database
            const userRepository = AppDataSource.getRepository(User);
            let user: User;
            user = await userRepository.findOneOrFail({ where: { username } });
            console.log(user);
            console.log("Found user!");

            //Check if encrypted password match
            // if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            //   res.status(401).send();
            //   return;
            // }
    
            const isPasswordValid = await PasswordHash.isPasswordValid(password, user.password);
            // Validate if the hashed password and plain password from req.body match

            if(!isPasswordValid) {
                throw new Error('The password is invalid!');
            }
    
            // Sign JWT, valid for 1 hour
            const token = jwt.sign({ userId: user.id, username: user.username }, this.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            console.log(token);
            
            //Send the jwt in the response
            res.send(token);
        } catch (error) {
            console.log("User not found!")
            res.status(401).send("Unauthorized!");
        }

    };

//   static changePassword = async (req: Request, res: Response) => {
//     //Get ID from JWT
//     const id = res.locals.jwtPayload.userId;

//     //Get parameters from the body
//     const { oldPassword, newPassword } = req.body;
//     if (!(oldPassword && newPassword)) {
//       res.status(400).send();
//     }

//     //Get user from the database
//     const userRepository = getRepository(User);
//     let user: User;
//     try {
//       user = await userRepository.findOneOrFail(id);
//     } catch (id) {
//       res.status(401).send();
//     }

//     //Check if old password matchs
//     if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
//       res.status(401).send();
//       return;
//     }

//     //Validate de model (password lenght)
//     user.password = newPassword;
//     const errors = await validate(user);
//     if (errors.length > 0) {
//       res.status(400).send(errors);
//       return;
//     }
//     //Hash the new password and save
//     user.hashPassword();
//     userRepository.save(user);

//     res.status(204).send();
//   };
}
export default AuthController;