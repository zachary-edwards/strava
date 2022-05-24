import express, { Router } from "express";
import { readFile } from "../services/filehelper";
import { getAtheleteActivities } from "../services/strava";
import { refreshAccessToken } from "../services/stravaAuthenticator";

const applicationRouter = Router();

applicationRouter.get('/', async (req: express.Request, res: express.Response) => {
  res.status(200).send('Ok')
})

applicationRouter.get('/healthz', (req: express.Request, res: express.Response) => {
  res.send('Strava app is running')
})

applicationRouter.get('/athlete', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const athleteActivites = await getAtheleteActivities()
    res.status(200).send(athleteActivites)
  } catch (err) {
    next(err)
  }
})

applicationRouter.get('/gear', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    //const athleteActivites = await getGearData()
    res.status(200).send('Ok')
  } catch (err) {
    next(err)
  }
})

applicationRouter.get('/file/:filename', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const fileData = readFile(req.params.filename)
    res.status(200).send(fileData)
  } catch (err) {
    next(err)
  }
})

applicationRouter.get('/token', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  await refreshAccessToken()
  res.status(200).send('okie dokie')
})

export { applicationRouter }
