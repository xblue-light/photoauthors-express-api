import { Router } from "express";
import { AuthController } from "../controller/AuthController";

const authRoutes: Router = Router();

authRoutes.post("/login", AuthController.login);

export default authRoutes;