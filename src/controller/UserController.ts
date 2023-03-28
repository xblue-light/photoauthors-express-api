import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { validate } from "class-validator";
import { PasswordHash } from "../utils/PasswordHash";

export class UserController {
    
    static getAll = async(req: Request, res: Response): Response<User> => {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const users = await userRepository.find({
                select: ["id", "username", "role"]
            })
    
            res.json(users);
        } catch (error) {}
    }

    static newUser = async(req: Request, res: Response): Response<User> => {
        try {
            const userRepository = AppDataSource.getRepository(User);
            let { username, password, email, role } = req.body;
            let user = new User();
            user.username = username;
            user.email = email;
            user.password = await PasswordHash.hashPassword(password);
            user.role = role;

            // Validate if the params are OK
            const errors = await validate(user);
            if(errors.length > 0) {
                console.log(errors);
                console.log("There was a validation error!");
                res.status(400).send(errors);
                return;
            }
            await userRepository.save(user);
            res.json(user);
            
        } catch (error) {
            res.status(500).send({ message: error })
        }
    }

}