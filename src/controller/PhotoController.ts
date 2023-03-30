import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Photo } from '../entity/Photo';
import { PhotoMetadata } from '../entity/PhotoMetadata';
import { User } from '../entity/User';
import { ERROR_MESSAGES } from '../utils/errorMessages';

export class PhotoController {
  static createNewPhoto = async (
    req: Request,
    res: Response,
  ): Response<Photo> => {
    try {
      const ur = AppDataSource.getRepository(User);
      const pr = AppDataSource.getRepository(Photo);

      // get user.id
      const userId = req.user.userId;

      const user = await ur.findOneOrFail({
        relations: ['photos'],
        where: {
          id: userId,
        },
      });

      // Extract photo payload from req.body
      const { name, description, filename, views, isPublished, metadata } =
        req.body;

      // Add some photos
      const photo = new Photo();
      photo.name = name;
      photo.description = description;
      photo.filename = filename;
      photo.views = views;
      photo.isPublished = isPublished;

      const metaData = new PhotoMetadata();
      metaData.comment = metadata.comment;
      metaData.compressed = metadata.compressed;
      metaData.height = metadata.height;
      metaData.orientation = metadata.orientation;
      metaData.width = metadata.width;

      // attach metadata to the photo entity
      photo.metadata = metadata;

      user.photos = [...user.photos, photo];

      // TODO: create userDTO for User entity
      console.log('Saving photo with metadata: ', photo);
      await ur.save(user); // here its enough to save the user so we dont need to explicitly save the photo since User#photos has cascade
      //await pr.save(photo);

      return res.status(200).send(photo);
    } catch (error) {
      return res.status(404).send({
        error: {
          message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
        },
      });
    }
  };

  static getAllPhotos = async (
    req: Request,
    res: Response,
  ): Response<Photo[]> => {
    try {
      const photoRepository = AppDataSource.getRepository(Photo);
      const userId = req.user.userId;

      const userPhotos = await photoRepository.find({
        relations: ['metadata'],
        where: {
          user: {
            id: userId,
          },
        },
      });

      return res.status(200).send(userPhotos);
    } catch (error) {
      return res.status(404).send({
        error: {
          message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
        },
      });
    }
  };

  static updateDescription = async (
    req: Request,
    res: Response,
  ): Response<any> => {
    try {
      const ur = AppDataSource.getRepository(User);
      const userId = req.user.userId; // Get the user ID from previous midleware

      const user = await ur.findOne({
        relations: ['photos'],
        where: {
          id: userId,
        },
      });

      // Retrieve the Photo entity with ID 2 from the user's photos array
      const updatedPhoto = user.photos.find(
        (photo) => photo.id === Number(req.params.id),
      ); // todo extract req.body.id from req.params

      updatedPhoto.description = req.body.description;

      // Save the updated Photo entity to the database
      await ur.save(user);
      res.status(200).send(updatedPhoto);
    } catch (error) {
      return res.status(404).send({
        error: {
          message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
        },
      });
    }
  };

  static updatePartial = async (req: Request, res: Response): Response<any> => {
    try {
      const qb = AppDataSource.getRepository(Photo).createQueryBuilder();
      const photoPayload: Partial<Photo> = req.body;

      if (Object.keys(photoPayload).length !== 0) {
        await qb
          .update(Photo)
          .set({ ...photoPayload })
          .where('id = :id', { id: req.params.photoId })
          .execute();
      }

      res.status(200).send(photoPayload);
    } catch (error) {
      return res.status(404).send(error);
    }
  };

  static delete = async (req: Request, res: Response): Response<any> => {
    try {
      const pr = AppDataSource.getRepository(Photo);
      // Find the photo we want to delete
      const photo = await pr.findOneOrFail({
        relations: ['user'],
        where: {
          id: req.params.photoId,
        },
      });

      // Delete the photo from the DB
      await pr.delete(photo);

      return res.status(200).send('OK!');
    } catch (error) {
      return res.status(404).send({
        error: {
          message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
        },
      });
    }
  };

  static updateMetaData = async (
    req: Request,
    res: Response,
  ): Response<any> => {
    try {
      const qb = AppDataSource.getRepository(Photo).createQueryBuilder();
      const metaDataPayload: Partial<Photo> = req.body;

      if (Object.keys(metaDataPayload).length !== 0) {
        await qb
          .update(PhotoMetadata)
          .set({ ...metaDataPayload })
          .where('photoId = :id', { id: req.params.photoId })
          .execute();
      }

      res.status(200).send(metaDataPayload);
    } catch (error) {
      return res.status(404).send(error);
    }
  };
}
