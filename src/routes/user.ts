import { Router } from "express";
import { UserController } from "../controller/UserController";

const userRoutes: Router = Router();

userRoutes.get("/all", UserController.getAll);
userRoutes.post("/create", UserController.newUser);

export default userRoutes;