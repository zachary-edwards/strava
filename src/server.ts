import express, { response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { applicationRouter } from './routes/application'
import { authorize, getAccessToken, refreshAccessToken } from './services/stravaAuthenticator'
import { AccessTokenRequest } from './models/accessTokenRequest'
import { readFile, writeFile } from './services/filehelper'
import { convertToEST } from './util/util'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '100mb' }))

const port = 3010;
export let requestCode = '';
export let ACCESS_TOKEN: AccessTokenRequest;

let haveValidAccessToken = false;

app.use(async (req: express.Request, res: express.Response, next) => {
  try {
    let accessTokenFile: AccessTokenRequest = readFile("access_token");

    if (!accessTokenFile) next();
    
    let expiresTime = accessTokenFile.expires_at * 1000;
    let currentTime = new Date().getTime();

    haveValidAccessToken = expiresTime - currentTime > 0;
    ACCESS_TOKEN = accessTokenFile;
    next();
  } catch (err) {
    console.error("Error in default express handler", err.message)
  }
})

app.use(async (req: express.Request, res: express.Response, next) => {
  try {
    if (ACCESS_TOKEN !== undefined || ACCESS_TOKEN !== null) next();
    else if (req.query.code || requestCode) {
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

app.use(async (req: express.Request, res: express.Response, next) => {
  try {
    if (ACCESS_TOKEN === undefined || ACCESS_TOKEN === null) {
      const accessToken = await getAccessToken();
      ACCESS_TOKEN = accessToken;
      writeFile("access_token", accessToken);
    }
    else if (!haveValidAccessToken) {
      await refreshAccessToken(ACCESS_TOKEN.refresh_token);
    }
    next()
  } catch (err) {
    console.error("Error in second default express handler", err.message);
  }
})

app.use(applicationRouter);

app.use(async (err: any, req: express.Request, res: express.Response, next: any) => {
  if (res.headersSent) {
    return next(err)
  }
  let url: string = err?.config?.url;
  let status: number = err?.response?.status;

  if ((url && url.includes('/v2/oauth/token') && status === 400) || status === 401) {
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