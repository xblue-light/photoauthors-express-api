import { Request, Response } from 'express';
import { Entity, EntityTarget } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Album } from '../entity/Album';
import { Author } from '../entity/Author';
import { Photo } from '../entity/Photo';
import { PhotoMetadata } from '../entity/PhotoMetadata';
import { User } from '../entity/User';
import { ERROR_MESSAGES } from '../utils/errorMessages';

const getRepository = (targetEntity: EntityTarget<any>) =>
  AppDataSource.getRepository(targetEntity);

export class PhotoController {
  static albumRepository = getRepository(Album);
  static userRepository = getRepository(User);
  static photoRepository = getRepository(Photo);
  static authorRepository = getRepository(Author);

  static createNewPhoto = async (
    req: Request,
    res: Response,
  ): Response<Photo> => {
    try {
      const albumRepository = AppDataSource.getRepository(Album);
      const userRepository = AppDataSource.getRepository(User);

      // get user.id from auth middleware
      const userId = req.user.userId;

      const user = await userRepository.findOneOrFail({
        relations: ['author', 'author.photos', 'author.photos.metadata'],
        where: {
          id: userId,
        },
      });

      // Extract photo payload from req.body
      const {
        name,
        description,
        filename,
        views,
        isPublished,
        metadata,
        author,
        album,
      } = req.body;

      // // Add some photos
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

      // Add new album
      const newAlbum = new Album();
      newAlbum.name = album.name; // from req.body

      // Save new album
      await albumRepository.save(newAlbum);

      // attach album/s to the photo entity
      photo.albums = [newAlbum];

      if (!user.author) {
        console.log('create new author!');
        const newAuthor = new Author();
        newAuthor.name = 'N/A'; //TODO: add author name from req.body
        console.log(newAuthor);
        newAuthor.photos = [photo];
        user.author = newAuthor; // here we connect the user with a new author hence userId will be a foreign key in author tbale
        await userRepository.save(user); // here its enough to save the user so we dont need to explicitly save the author since User#author has cascade
        return res.status(201).send(user);
      }

      user.author.photos = [...user.author.photos, photo];
      await userRepository.save(user); // here its enough to save the user so we dont need to explicitly save the author since User#author has cascade

      res.status(201).send('Resource was created successfully!');
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
      // const photoRepository = AppDataSource.getRepository(Photo);

      // This will load all the user photos for all the users in the DB and all the photo entity relations.
      const userPhotos = await this.photoRepository.find({
        relations: ['metadata', 'author', 'author.user', 'albums'],
      });

      console.log(userPhotos);

      return res.status(200).send(userPhotos);
    } catch (error) {
      return res.status(404).send({
        error: {
          message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
        },
      });
    }
  };

  static getAllPhotosByUserId = async (
    req: Request,
    res: Response,
  ): Response<Photo[]> => {
    try {
      // const photoRepository = AppDataSource.getRepository(Photo);
      // const authorRepository = AppDataSource.getRepository(Author);

      // gets all authors
      // console.log(
      //   await authorRepository.find({
      //     relations: ['photos', 'user'],
      //   }),
      // );

      // get author by user id
      // console.log(
      //   await authorRepository.find({
      //     relations: ['photos', 'user'],
      //     where: {
      //       user: {
      //         id: userId,
      //       },
      //     },
      //   }),
      // );

      const userPhotos = await this.photoRepository.find({
        relations: ['metadata', 'author', 'author.user', 'albums'],
        where: {
          author: {
            user: {
              id: req.params.userId, // User ID from middleware or we can access userId from the req.params.userId
            },
          },
        },
        select: ['description', 'albums', 'filename', 'author', 'id', 'name'],
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

  static updatePartial = async (
    req: Request,
    res: Response,
  ): Response<{ status: string }> => {
    try {
      //const pr = AppDataSource.getRepository(Photo);
      const payload: Partial<Photo> = req.body;

      await this.photoRepository
        .createQueryBuilder()
        .update(Photo)
        .set({ ...payload })
        .where('id = :id', { id: req.params.photoId })
        .execute();

      res.status(200).send({ status: 'Successfully updated resource.' });
    } catch (error) {
      return res.status(404).send(error);
    }
  };

  static delete = async (req: Request, res: Response): Response<any> => {
    try {
      //const pr = AppDataSource.getRepository(Photo);
      // Find the photo we want to delete

      const photo = await this.photoRepository.findOneOrFail({
        where: {
          id: req.params.photoId,
        },
      });

      console.log(photo);

      // Delete the photo from the DB
      await this.photoRepository.delete(photo);

      res.status(200).send({ status: 'Successfully deleted resource.' });
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
      //const qb = AppDataSource.getRepository(Photo).createQueryBuilder();
      const metaDataPayload: Partial<Photo> = req.body;

      if (Object.keys(metaDataPayload).length !== 0) {
        await this.photoRepository
          .createQueryBuilder()
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
