import axios, { AxiosResponse } from 'axios'
import express from 'express';
import { AccessTokenRequest } from '../models/accessTokenRequest';

const authUrl = 'https://www.strava.com/oauth/authorize'
const url = "https://www.strava.com/api/v3";
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret
const refreshToken = process.env.refreshToken
const redirectUri = process.env.redirectUri
const gearIds = []
let accessToken = ''
let requestCode = ''

const authorize = async (res: express.Response) => {
  res.redirect(`${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&approval_prompt=auto&scope=activity:write,read_all,activity:read_all`)
}

const getAccessToken = async () => {
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    code: requestCode,
    grant_type: "authorization_code"
  }

  const resp: AxiosResponse<AccessTokenRequest> = await axios(`${url}/oauth/token`, {
    method: 'POST',
    data: body
  }).catch(err => {
    console.error('Error AccessToken token', err.message)
  }) as AxiosResponse

  accessToken = resp.data.access_token
  console.log('Access token', accessToken)
}

const refreshAccessToken = async () => {
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken
  }

  const resp = await axios(`${url}/oauth/token`, {
    method: 'POST',
    data: body
  }).catch(err => {
    console.error('Error refressing token', err.message)
  }) as AxiosResponse

  console.log('respone', resp)

  accessToken = resp.data["access_token"]
}

const getAtheleteActivities = async () => {
  let totalActivites = [];
  let activities = []
  let page = 1;

  do {
    var res = await axios(`${url}/athlete/activities?page=${page}&per_page=30`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    activities = res.data
    totalActivites.push(activities)
    page++;
  }
  while (page < 50 && activities.length === 30)
  totalActivites = totalActivites.flat()
  const reducedGearIds = totalActivites.map(activity => activity.gear_id)

  reducedGearIds.forEach(gearId => {
    if (!gearIds.includes(gearId) && gearId)
      gearIds.push(gearId)
  })

  gearIds.forEach(gearId => {
    let activitiesPerGearId = totalActivites.filter(activity => activity.gear_id === gearId)
    let movingTime = activitiesPerGearId.reduce((a,b) => a + b.moving_time, 0)
    console.log('Moving time?', movingTime, 'GearId', gearId)
  })
  return totalActivites
}

const setRequestCode = (code: string) => {
  requestCode = code
  console.log(requestCode)
}


export { authorize, refreshAccessToken, setRequestCode, getAccessToken, getAtheleteActivities }