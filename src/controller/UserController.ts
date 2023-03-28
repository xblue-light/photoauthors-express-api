import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { Repository } from 'typeorm'
import { UserRepository } from '../repository/UserRepository';
import { validate } from "class-validator";
import { PasswordHash } from "../utils/passwordHash";


export class UserController {

    
    public getAll = async(req: Request, res: Response) => {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const users = await userRepository.find({
                select: ["id", "username", "role"]
            })
    
            res.json(users);
        } catch (error) {}
    }

    static newUser = async(req: Request, res: Response) => {

        try {
            const userRepository = AppDataSource.getRepository(User);
            let { username, password, email, role } = req.body;
            let user = new User();
            user.username = username;
            user.email = email;
            user.password = await PasswordHash.hashPassword(password);
            user.role = role;

            console.log(user);

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

    // async one(request: Request, response: Response, next: NextFunction) {
    //     const id = parseInt(request.params.id)
        

    //     const user = await this.userRepository.findOne({
    //         where: { id }
    //     })

    //     if (!user) {
    //         return "unregistered user"
    //     }
    //     return user
    // }



    // async remove(request: Request, response: Response, next: NextFunction) {
    //     const id = parseInt(request.params.id)

    //     let userToRemove = await this.userRepository.findOneBy({ id })

    //     if (!userToRemove) {
    //         return "this user not exist"
    //     }

    //     await this.userRepository.remove(userToRemove)

    //     return "user has been removed"
    // }

}