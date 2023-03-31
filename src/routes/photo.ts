import { Router } from 'express';
import { PhotoController } from '../controller/PhotoController';
import { checkJWT } from '../middleware/checkJWT';
import { checkRole } from '../middleware/checkRole';

const routes: Router = Router();

// Create new post
routes.post(
  '/new',
  [checkJWT, checkRole(['ADMIN', 'SUPER_USER'])],
  PhotoController.createNewPhoto,
);

// Get all photos by userId
routes.get(
  '/getAll/:userId',
  [checkJWT, checkRole(['SUPER_USER'])],
  PhotoController.getAllPhotosByUserId,
);

routes.get(
  '/getAll',
  [checkJWT, checkRole(['SUPER_USER'])],
  PhotoController.getAllPhotos,
);

// Update photo details by photoId
routes.patch(
  '/update/:photoId',
  [checkJWT, checkRole(['ADMIN', 'SUPER_USER'])],
  PhotoController.updatePartial,
);

// Update a photos metadata details by photoId
routes.patch(
  '/update/metadata/:photoId',
  [checkJWT, checkRole(['ADMIN', 'SUPER_USER'])],
  PhotoController.updateMetaData,
);

// Delete a photo by photoId
routes.delete(
  '/delete/:photoId',
  [checkJWT, checkRole(['ADMIN', 'SUPER_USER'])],
  PhotoController.delete,
);

export default routes;
