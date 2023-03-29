import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    // Get the user ID from previous midleware
    if(!res.locals.jwtPayload) {
        console.log("In check role middleware calling next...")
        return next();
    }

    let user: User;
    
    try {
        console.log("Extracting user ID from previous middleware...")
        // Get user role from the database
        const userRepository = AppDataSource.getRepository(User);
        const userId = res.locals.jwtPayload.userId;
        user = await userRepository.findOne({ where: { "id": userId } });
        if (user) {
            console.log("User was found!", user);
        }
    } catch (err) {
        console.log("An error occured in try/catch user role middleware!")
        return next();
    }

    // Check if array of authorized roles includes the user's role
    // TODO: Check for user.role property
    if (roles.indexOf(user.role.trim()) > -1) {
        console.log("USER ROLE MATCHES!:", user.role);
        return next();
    }
    else {
        return res.status(401).send("Error: Insufficient user role!");
    }

  };
};