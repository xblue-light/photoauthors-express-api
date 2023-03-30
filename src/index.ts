import * as dotenv from 'dotenv'
dotenv.config()
import { AppDataSource } from './data-source'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import helmet from 'helmet'
import routes from './routes'

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express()

    // Middleware
    app.use(cors())
    app.use(helmet())
    app.use(bodyParser.json())

    // Set all routes from routes folder
    app.use('/', routes)

    // start express server
    app.listen(3000, () => {
      console.log('Express server has started on port 3000.')
    })
  })
  .catch((error) => console.log(error))
