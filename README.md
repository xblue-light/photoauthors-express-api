# Unsplash API

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
4. Start the application: `npm start`

## Usage

To start the server, run `npm start`. The server will start on `http://localhost:3000`.

## API Documentation

This API follows the RESTful API design principles and utilizes the following HTTP methods:

- `GET`: Retrieve a resource or a collection of resources.
- `POST`: Create a new resource.
- `PUT` or `PATCH`: Update an existing resource.
- `DELETE`: Delete an existing resource.

### Resources

List the resources available in the API and their descriptions.

#### Photo Controller

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| GET    | `/getAll`          | Retrieve all photos |
| POST   | `/new`             | Create resource     |
| PUT    | `/update/:photoId` | Update resource     |
| DELETE | `/delete/:photoId` | Delete resource     |

#### Auth Controller

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| POST   | `/login`       | Login with user creds      |
| POST   | `/newPassword` | Change user password login |

#### User Controller

| Method | Endpoint  | Description     |
| ------ | --------- | --------------- |
| GET    | `/all`    | Get all users   |
| POST   | `/create` | Create new user |

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
