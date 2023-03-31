import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Album } from './entity/Album';
import { Author } from './entity/Author';
import { Photo } from './entity/Photo';
import { PhotoMetadata } from './entity/PhotoMetadata';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'jadensmith',
  password: '123pass123',
  database: 'unsplashdb_dev',
  // host: process.env.POSTGRES_HOSTNAME,
  // username: process.env.POSTGRES_USERNAME,
  // password: process.env.POSTGRES_PASSWORD,
  // database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  logging: true,
  entities: [User, Author, Photo, PhotoMetadata, Album],
  //migrations: ['src/migrations/*.{ts, js}'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: [],
});
