import { Router } from "express";
import userRoutes from "./user";
import authRoutes from "./auth";

const routes = Router();

//routes.use("/auth", user);
//routes.use("/photos", photos);
routes.use("/user", userRoutes);
routes.use("/auth", authRoutes);

export default routes;