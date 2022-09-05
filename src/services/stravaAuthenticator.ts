import axios, { AxiosResponse } from "axios";
import express from "express";
import { AccessTokenRequest, AtheleteTokenRequest } from "../models/accessTokenRequest";
import { requestCode } from "../server";

const authUrl = 'https://www.strava.com/oauth/authorize'
const url = "https://www.strava.com/api/v3";
const clientId = process.env.clientId;
const redirectUri = process.env.redirectUri
const clientSecret = process.env.clientSecret
let accessToken = ''

const authorize = async (req: express.Request, res: express.Response) => {
  console.log("redirected")
  res.redirect(`${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}${req.url}&response_type=code&approval_prompt=auto&scope=activity:write,read_all,activity:read_all`)
}

const getAccessToken = async (): Promise<AccessTokenRequest> => {
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
    console.error('Error while getting AccessToken', err.message)
    throw err
  }) as AxiosResponse

  return resp.data
}

const refreshAccessToken = async (refreshToken: string) => {
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
    console.error("Error while refreshing token", err.message)
    throw err;
  }) as AxiosResponse

  accessToken = resp.data["access_token"]
}

const makeRequest = async (url: string) => {
  try {
    const { athlete, access_token } = await getAccessToken();
    const res = await axios(url, {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    })
    return {
      res: res,
      athlete: athlete
    }
  } 
  catch (err) { 
    console.error('Error making request to ' + url, err.message)
    throw err;
  }
}

export { authorize, getAccessToken, makeRequest, refreshAccessToken }