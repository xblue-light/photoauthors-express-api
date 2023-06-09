import { Router } from 'express';
import { PhotoController } from '../controller/PhotoController';
import { checkJWT } from '../middleware/checkJWT';
import { checkRole } from '../middleware/checkRole';

const routes: Router = Router();

// Create new post
routes.post(
  '/new',
  [checkJWT, checkRole(['ADMIN'])],
  PhotoController.createNewPhoto,
);

// Get all photos by userId
routes.get(
  '/getAll/:userId',
  [checkJWT, checkRole(['ADMIN'])],
  PhotoController.getAllPhotosByUserId,
);

routes.get(
  '/getAll',
  [checkJWT, checkRole(['ADMIN'])],
  PhotoController.getAllPhotos,
);

// Update photo details by photoId
routes.patch(
  '/update/:photoId',
  [checkJWT, checkRole(['ADMIN'])],
  PhotoController.updatePartial,
);

// Update a photos metadata details by photoId
routes.patch(
  '/update/metadata/:photoId',
  [checkJWT, checkRole(['ADMIN'])],
  PhotoController.updateMetaData,
);

// Delete a photo by photoId
routes.delete(
  '/delete/:photoId',
  [checkJWT, checkRole(['ADMIN'])],
  PhotoController.delete,
);

export default routes;
