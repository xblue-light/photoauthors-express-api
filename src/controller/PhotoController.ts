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
}
