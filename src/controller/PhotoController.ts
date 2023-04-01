import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Album } from '../entity/Album';
import { Author } from '../entity/Author';
import { Photo } from '../entity/Photo';
import { PhotoMetadata } from '../entity/PhotoMetadata';
import { User } from '../entity/User';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { RESPONSE_STATUS } from '../utils/ResponseStatus';

export class PhotoController {
  // Define the application data source repositories
  static albumRepo: Repository<Album> = AppDataSource.getRepository(Album);
  static userRepo: Repository<User> = AppDataSource.getRepository(User);
  static photoRepo: Repository<Photo> = AppDataSource.getRepository(Photo);
  static authorRepo: Repository<Author> = AppDataSource.getRepository(Author);

  static createNewPhoto = async (
    req: Request,
    res: Response,
  ): Response<Photo> => {
    try {
      // get user.id from auth middleware
      const userId = req.user.userId;

      const user = await this.userRepo.findOneOrFail({
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

      // Add some photos
      // TODO: Add DTO
      const photo = new Photo();
      photo.name = name;
      photo.description = description;
      photo.filename = filename;
      photo.views = views;
      photo.isPublished = isPublished;

      const metaData = new PhotoMetadata();
      // TODO: Add DTO
      metaData.comment = metadata.comment;
      metaData.compressed = metadata.compressed;
      metaData.height = metadata.height;
      metaData.orientation = metadata.orientation;
      metaData.width = metadata.width;

      // Attach metadata to the photo entity
      photo.metadata = metadata;

      // Add new album
      const newAlbum = new Album();
      // TODO: Add DTO
      newAlbum.name = album.name; // from req.body

      // Save new album
      await this.albumRepo.insert(newAlbum);

      // Attach album/s to the photo entity
      photo.albums = [newAlbum];

      if (!user.author) {
        const newAuthor = new Author();
        newAuthor.name = author.name;
        newAuthor.photos = [photo];
        user.author = newAuthor; // Here we connect the user with a new author hence userId will be a foreign key in author table

        await this.userRepo.update(userId, {
          author: newAuthor,
        });

        return res.status(201).json(user);
      }

      user.author.photos = [...user.author.photos, photo];

      // Here its enough to save the user so we dont need to explicitly save the author since User#author has cascade
      await this.userRepo.save(user);

      return res.status(200).json({ status: RESPONSE_STATUS.CREATED });
    } catch (error) {
      return res.status(404).json({
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
      // This will load all the user photos for all the users in the DB and all the photo entity relations.
      const userPhotos = await this.photoRepo.find({
        relations: ['metadata', 'author', 'author.user', 'albums'],
      });

      res.status(200).json(userPhotos);
    } catch (error) {
      return res.status(404).json({
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
      // gets all authors
      // console.log(
      //   await this.authorRepo.find({
      //     relations: ['photos', 'user'],
      //   }),
      // );

      // get author by user id
      // console.log(
      //   await this.authorRepo.find({
      //     relations: ['photos', 'user'],
      //     where: {
      //       user: {
      //         id: userId,
      //       },
      //     },
      //   }),
      // );

      const allPhotosByUserId = await this.photoRepo.find({
        relations: ['metadata', 'author', 'author.user', 'albums'],
        where: {
          author: {
            user: {
              id: req.params.userId,
            },
          },
        },
        select: ['description', 'albums', 'filename', 'author', 'id', 'name'],
      });

      res.status(200).json(allPhotosByUserId);
    } catch (err) {
      return res.status(404).json({
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
      const photoPayload: Partial<Photo> = req.body;

      await this.photoRepo
        .createQueryBuilder()
        .update(Photo)
        .set({ ...photoPayload })
        .where('id = :id', { id: req.params.photoId })
        .execute();

      res.status(200).json({ status: RESPONSE_STATUS.UPDATED });
    } catch (error) {
      return res.status(404).json({
        error: {
          message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
        },
      });
    }
  };

  static delete = async (req: Request, res: Response): Response<any> => {
    try {
      const photo = await this.photoRepo.findOneOrFail({
        where: {
          id: req.params.photoId,
        },
      });

      // Delete the photo from the DB
      await this.photoRepo.delete(photo);

      res.status(200).json({ status: RESPONSE_STATUS.REMOVED });
    } catch (error) {
      return res.status(404).json({
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
      const payload: Partial<Photo> = req.body;
      await this.photoRepo
        .createQueryBuilder()
        .update(PhotoMetadata)
        .set({ ...payload })
        .where('photoId = :id', { id: req.params.photoId })
        .execute();

      res.status(200).json({ status: RESPONSE_STATUS.UPDATED });
    } catch (error) {
      return res.status(404).json({
        error: {
          message: ERROR_MESSAGES.REQUEST_NOT_FOUND,
        },
      });
    }
  };
}
