import { Router } from "express";
import { UserController } from "../controller/UserController";
import { User } from "../entity/User";

const userRoutes: Router = Router();

const userController = new UserController();



userRoutes.get("/", userController.getAll.bind(userController));
userRoutes.post("/create", UserController.newUser);

export default userRoutes;