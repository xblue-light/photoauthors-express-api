import { Router } from 'express';
import { AuthController } from '../controller/AuthController';

const authRoutes: Router = Router();

authRoutes.post('/login', AuthController.login);
authRoutes.post('/changePassword', AuthController.changePassword);

export default authRoutes;
