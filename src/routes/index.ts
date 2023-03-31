import { Router } from 'express';
import userRoutes from './user';
import authRoutes from './auth';
import photoRoutes from './photo';
import authorRoutes from './author';
const routes = Router();

routes.use('/user', userRoutes);
routes.use('/auth', authRoutes);
routes.use('/photo', photoRoutes);
routes.use('/author', authorRoutes);

export default routes;
