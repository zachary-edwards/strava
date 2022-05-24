import express, { response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { applicationRouter } from './routes/application'
import { authorize } from './services/stravaAuthenticator'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '100mb' }))

const port = 3010;
export let requestCode = ''

app.use(async (req: express.Request, res: express.Response, next) => {
  try {
    if (req.query.code || requestCode) {
      requestCode = req.query.code as string || requestCode;
      next();
    }
    else {
      await authorize(req, res)
    }
  } catch (err) {
    console.error("Error in default express handler", err.message)
  }
})

app.use(applicationRouter);

app.use(async (err: any, req: express.Request, res: express.Response, next: any) => {
  if (res.headersSent) {
    return next(err)
  }
  let url: string = err?.config?.url;
  let status: number = err?.response?.status;

  if ((url.includes('/v2/oauth/token') && status === 400) || status === 401) {
    console.log("what")
    await authorize(req, res)
  } else { 
    res.status(status || 500)
    res.send(err.message || 'An unknown error occured')
  }
})


app.listen(port, () => {
  console.log('Server started on', port)
})