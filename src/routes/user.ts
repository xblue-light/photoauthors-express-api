import { Router } from "express";
import { UserController } from "../controller/UserController";
import { checkJWT } from "../middleware/checkJWT";
import { checkRole } from "../middleware/checkRole";

const userRoutes: Router = Router();

userRoutes.get("/all", [checkJWT, checkRole(['ADMIN'])], UserController.getAll);
userRoutes.post("/create", [checkJWT, checkRole(['ADMIN'])], UserController.newUser);

export default userRoutes;