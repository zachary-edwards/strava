import axios, { AxiosResponse } from "axios";
import express from "express";
import { AccessTokenRequest, AtheleteTokenRequest } from "../models/accessTokenRequest";

const authUrl = 'https://www.strava.com/oauth/authorize'
const url = "https://www.strava.com/api/v3";
const clientId = process.env.clientId;
const redirectUri = process.env.redirectUri
const clientSecret = process.env.clientSecret
const refreshToken = process.env.refreshToken
let accessToken = ''
let requestCode = ''

const authorize = async (res: express.Response) => {
  res.redirect(`${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&approval_prompt=auto&scope=activity:write,read_all,activity:read_all`)
}

const getAccessToken = async (): Promise<{ accessToken: 'string', athlete: AtheleteTokenRequest }> => {
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

  return {
    accessToken: resp.data.access_token,
    athlete: resp.data.athlete
  }
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

const makeRequest = async (url: string) => {
  try {
    const { athlete, accessToken } = await getAccessToken();
    const res = await axios(url, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    return {
      res: res,
      athlete: athlete
    }
  } 
  catch (err) { 
    console.error('Error making request to ' + url, err)
  }
}

const setRequestCode = (code: string) => {
  requestCode = code
  console.log(requestCode)
}


export { authorize, getAccessToken, makeRequest, refreshAccessToken, setRequestCode }