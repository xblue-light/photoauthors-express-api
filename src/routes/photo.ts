import { Router } from 'express'
import { PhotoController } from '../controller/PhotoController'
import { checkJWT } from '../middleware/checkJWT'
import { checkRole } from '../middleware/checkRole'

const routes: Router = Router()
routes.get(
  '/new',
  [checkJWT, checkRole(['ADMIN'])],
  PhotoController.createNewPhoto
)
routes.get(
  '/getAll',
  [checkJWT, checkRole(['ADMIN'])],
  PhotoController.getAllPhotos
)
routes.put(
  '/update/:id',
  [checkJWT, checkRole(['ADMIN'])],
  PhotoController.update
)
routes.delete(
  '/delete/:photoId',
  [checkJWT, checkRole(['ADMIN'])],
  PhotoController.delete
)

export default routes
