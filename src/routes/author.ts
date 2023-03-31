import { Router } from 'express';
import { AuthorController } from '../controller/AuthorController';
import { checkJWT } from '../middleware/checkJWT';
import { checkRole } from '../middleware/checkRole';

const routes: Router = Router();

// Create new post
routes.post(
  '/new',
  [checkJWT, checkRole(['ADMIN'])],
  AuthorController.newAuthor,
);

routes.patch(
  '/updateName',
  [checkJWT, checkRole(['ADMIN'])],
  AuthorController.updateAuthorName,
);

export default routes;
