import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Author } from './entity/Author'
import { Photo } from './entity/Photo'
import { PhotoMetadata } from './entity/PhotoMetadata'
import { User } from './entity/User'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOSTNAME,
  port: 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Author, Photo, PhotoMetadata],
  migrations: [],
  subscribers: [],
})
