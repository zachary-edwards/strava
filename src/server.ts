import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import { getAtheleteActivities, getGearData } from './services/strava'
import { readFile } from './services/filehelper'
import { authorize, setRequestCode, refreshAccessToken } from './services/stravaAuthenticator'
const app = express()
app.use(helmet())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '100mb' }))

const port = 3010;

app.get('/', async (req: express.Request, res: express.Response) => {
  try {
    if (!req.query.code)
      authorize(res)
    else {
      setRequestCode(req.query.code as string)
      res.redirect('/gear')
    }
  } catch (err) {
    console.error(err.message)
  }
})

app.get('/healthz', (req: express.Request, res: express.Response) => {
  res.send('Strava app is running')
})

app.get('/athlete', async (req: express.Request, res: express.Response) => {
  try {
    const athleteActivites = await getAtheleteActivities()
    res.status(200).send(athleteActivites)
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).send(err.message || 'uh oh')
  }
})

app.get('/gear', async (req: express.Request, res: express.Response) => {
  try {
    const athleteActivites = await getGearData()
    res.status(200).send('Ok')
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).send(err.message || 'uh oh')
  }
})

app.get('/file/:filename', async (req: express.Request, res: express.Response) => {
  try {
    const fileData = readFile(req.params.filename)
    res.status(200).send(fileData)
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).send(err.message || 'uh oh')
  }
})

app.get('/token', async (req: express.Request, res: express.Response) => {
  await refreshAccessToken()
  res.status(200).send('okie dokie')
})


app.listen(port, () => {
  console.log('Server started on', port)
})