import { NextFunction, Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Photo } from '../entity/Photo'
import { User } from '../entity/User'

export class PhotoController {
  static createNewPhoto = async (
    req: Request,
    res: Response
  ): Response<Photo> => {
    try {
      const ur = AppDataSource.getRepository(User)
      // get user.id
      const userId = req.user.userId

      const user = await ur.findOne({
        relations: ['photos'],
        where: {
          id: userId, // where the id is of the author. expecting three 3 photos connected to this single author
        },
      })

      // todo: wrap in try/catch and instead of findOne should be findOneOrFail
      if (user) {
        console.log('User found!')
        console.log(user)
      }

      // Extract photo payload from req.body
      const { name, description, filename, views, isPublished } = req.body

      // Add some photos
      const photo = new Photo()
      ;(photo.name = name),
        (photo.description = description),
        (photo.filename = filename),
        (photo.views = views),
        (photo.isPublished = isPublished)

      user.photos = [...user.photos, photo]

      // TODO: create userDTO for User entity
      // update user.photos
      ur.save(user)

      return res.status(200).send(photo)
    } catch (error) {
      res.status(404).send('Your request could not be processed!')
    }
  }

  static getAllPhotos = async (
    req: Request,
    res: Response
  ): Response<Photo[]> => {
    try {
      const ur = AppDataSource.getRepository(User)
      // get user.id
      const userId = req.user.userId
      const user = await ur.findOne({
        relations: ['photos'],
        where: {
          id: userId, // where the id is of the author. expecting three 3 photos connected to this single author
        },
      })

      return res.status(200).send(user)
    } catch (error) {
      res.status(404).send('Your request could not be processed!')
    }
  }

  static update = async (req: Request, res: Response): Response<any> => {
    try {
      const ur = AppDataSource.getRepository(User)
      const userId = req.user.userId // Get the user ID from previous midleware

      const user = await ur.findOne({
        relations: ['photos'],
        where: {
          id: userId,
        },
      })

      // Retrieve the Photo entity with ID 2 from the user's photos array
      const updatedPhoto = user.photos.find(
        (photo) => photo.id === Number(req.params.id)
      ) // todo extract req.body.id from req.params
      updatedPhoto.description = req.body.description

      // Save the updated Photo entity to the database
      await ur.save(user)
      res.status(200).send(updatedPhoto)
    } catch (error) {
      res.status(404).send('Your request could not be processed!')
    }
  }

  static delete = async (req: Request, res: Response): Response<any> => {
    try {
      const pr = AppDataSource.getRepository(Photo)
      // Find the photo we want to delete
      const photo = await pr.findOneOrFail({
        relations: ['user'],
        where: {
          id: req.params.photoId,
        },
      })

      // Delete the photo from the DB
      await pr.delete(photo)

      return res.status(200).send('OK!')
    } catch (error) {
      return res.status(404).send('Photo was not found!')
    }
  }
}
