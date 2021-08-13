import express, { Router } from "express";
import { readFile } from "../services/filehelper";
import { getAtheleteActivities } from "../services/strava";
import { authorize, setRequestCode, refreshAccessToken } from "../services/stravaAuthenticator";

const applicationRouter = Router();

applicationRouter.get('/', async (req: express.Request, res: express.Response) => {
    try {
        if (!req.query.code)
            authorize(res)
        else {
            setRequestCode(req.query.code as string)
            res.redirect('/athlete')
        }
    } catch (err) {
        console.error(err.message)
    }
})

applicationRouter.get('/healthz', (req: express.Request, res: express.Response) => {
    res.send('Strava app is running')
})

applicationRouter.get('/athlete', async (req: express.Request, res: express.Response) => {
    try {
        const athleteActivites = await getAtheleteActivities()
        res.status(200).send(athleteActivites)
    } catch (err) {
        console.error(err)
        res.status(err.status || 500).send(err.message || 'uh oh')
    }
})

applicationRouter.get('/gear', async (req: express.Request, res: express.Response) => {
    try {
        //const athleteActivites = await getGearData()
        res.status(200).send('Ok')
    } catch (err) {
        console.error(err)
        res.status(err.status || 500).send(err.message || 'uh oh')
    }
})

applicationRouter.get('/file/:filename', async (req: express.Request, res: express.Response) => {
    try {
        const fileData = readFile(req.params.filename)
        res.status(200).send(fileData)
    } catch (err) {
        console.error(err)
        res.status(err.status || 500).send(err.message || 'uh oh')
    }
})

applicationRouter.get('/token', async (req: express.Request, res: express.Response) => {
    await refreshAccessToken()
    res.status(200).send('okie dokie')
})

export { applicationRouter }
