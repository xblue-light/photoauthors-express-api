import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { PasswordHash } from "../utils/PasswordHash";
import { ACCESS_TOKEN_EXPIRATION_TIME, ACCESS_TOKEN_SECRET } from "../../config";

export class AuthController {
    static login = async (req: Request, res: Response) => {
        try {

            // console.log(res.headers);
            // console.log(res.locals.jwtPayload = {data: 321321321321})
            // console.log(res.locals)
            // Check if username and password are set
            let {
                username,
                password
            } = req.body;
            
            if (!(username && password)) {
                res.sendStatus(400);
            }
       
            // Get user from database
            const userRepository = AppDataSource.getRepository(User);
            let user: User;
       
            user = await userRepository.findOne({
                where: {
                    username
                }
            });
       
            if (!user) {
                throw new Error("User not found!")
            }
       
            // Validate if the hashed password and plain password from req.body match
            const isPasswordValid = await PasswordHash.isPasswordValid(password, user.password);
       
            if (!isPasswordValid) {
                console.log("The password is not valid!")
                return res.status(401).send({error: "The password is not valid!"});
            }
       
            // Sign JWT, valid for 1 hour
            const token = jwt.sign({
                userId: user.id,
                username: user.username
            }, ACCESS_TOKEN_SECRET, {
                expiresIn: ACCESS_TOKEN_EXPIRATION_TIME
            });
       
            // Send the jwt in the response
            res.send(token);
        } catch (error) {
 
            res.status(401).send({
                error: error
            });
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