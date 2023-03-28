import {Router, Request, Response} from "express";
//import auth from "./auth";
import userRoutes from "./user";

const routes = Router();

//routes.use("/auth", user);
//routes.use("/photos", photos);
routes.use("/user", userRoutes);

export default routes;