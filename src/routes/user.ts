import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { checkJWT } from '../middleware/checkJWT';
import { checkRole } from '../middleware/checkRole';

const userRoutes: Router = Router();

userRoutes.get(
  '/all',
  [checkJWT, checkRole(['SUPER_USER'])],
  UserController.getAll,
);
userRoutes.post('/create', [checkRole(['SUPER_USER'])], UserController.newUser);

export default userRoutes;
