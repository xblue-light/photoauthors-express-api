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

Describe the database schema used in the application. You can use diagrams, text, or both to describe the schema.

## License

This project is licensed under the [MIT License](LICENSE).
