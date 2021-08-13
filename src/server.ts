import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import { applicationRouter } from './routes/application'

const app = express()
app.use(helmet())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '100mb' }))

const port = 3010;

app.use(applicationRouter)

app.use((err: any, req: express.Request, res: express.Response, next: any) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.code || 500)
  res.render(err.message || 'An unknown error occured')
})

app.listen(port, () => {
  console.log('Server started on', port)
})