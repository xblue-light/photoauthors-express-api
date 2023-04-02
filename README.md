# Photo Authors API

This is a minimalistic Express.js application leveraging TypeORM and TS.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [License](#license)

## Installation

1. Clone the repository: `git clone <repository-url>`
2. Install the dependencies: `npm install`
3. Create a `.env` file in the root directory and set the necessary environment variables (see `.env.example` for reference).
4. Start the application: `npm run start:dev`

## Usage

To start the dev server, run `npm run start:dev`. The Express.js server will listen on `http://localhost:3000`.

## API Documentation

This API follows the RESTful API design principles and utilizes the following HTTP methods:

- `GET`: Retrieve a resource or a collection of resources.
- `POST`: Create a new resource.
- `PUT` or `PATCH`: Update an existing resource.
- `DELETE`: Delete an existing resource.

### Resources

List the resources available in the API and their descriptions.

#### Unsplash API Swagger

| Method | Endpoint    | Description               |
| ------ | ----------- | ------------------------- |
| GET    | `/api-docs` | Swagger API documentation |

#### Photo Controller

| Method | Endpoint                          | Description                      |
| ------ | --------------------------------- | -------------------------------- |
| POST   | `/photo/new`                      | Create new photo resource        |
| GET    | `/photo/getAll`                   | Retrieve all photos              |
| GET    | `/photo/getAll/:userId`           | Retrieve all photos by userId    |
| GET    | `/photo/get/:photoId`             | Retrieve single photo by photoId |
| PATCH  | `/photo/update/:photoId`          | Update photo by photoId          |
| PATCH  | `/photo/update/metadata/:photoId` | Update photo metadata by photoId |
| DELETE | `/photo/delete/:photoId`          | Delete photo by photoId          |

#### Auth Controller

| Method | Endpoint            | Description                      |
| ------ | ------------------- | -------------------------------- |
| POST   | `/auth/login`       | Login with user creds            |
| POST   | `/auth/newPassword` | Change user password credentials |

#### User Controller

| Method | Endpoint       | Description                                          |
| ------ | -------------- | ---------------------------------------------------- |
| GET    | `/user/all`    | Get all users (only for users with role: SUPER_USER) |
| POST   | `/user/create` | Create new user                                      |

#### Author Controller

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/author/new`        | Create a new author |
| PATCH  | `/author/updateName` | Update author name  |

### Authentication

If authentication is required, list the available authentication methods and how to use them.

### Rate Limiting

If rate limiting is implemented, explain the rate limiting policy.

## Database Schema

### TypeORM Migrations

In TypeORM, `migration:create` and `migration:generate` are two commands used to create new migration files, but they differ in how they generate the file.

`migration:create` creates an empty migration file with a timestamp and a name you provide, whereas `migration:generate` generates a migration file based on changes detected in your database schema.

Here are the key differences between the two commands:

`migration:create` creates a blank migration file with no content, so you need to manually add the code to modify your database schema. This command is useful if you want to create a migration file from scratch.

`migration:generate` generates a migration file based on the current state of your database schema. TypeORM compares the current schema with the previous schema and generates a migration file that contains the necessary SQL statements to update the schema. This command is useful if you've made changes to your database schema and want to generate a migration file to apply those changes.

## License

This project is licensed under the [MIT License](LICENSE).
