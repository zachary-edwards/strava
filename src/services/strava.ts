import axios, { AxiosResponse } from 'axios'
import { AtheleteTokenRequest } from '../models/accessTokenRequest';
import { getReducedGearIds } from '../util/util';
import { fileExists, readFile, writeFile } from './filehelper';
import { getAccessToken } from './stravaAuthenticator';

const url = "https://www.strava.com/api/v3";
const gearIds = []

const getAthelete = async () => {
  await getAccessToken()

}

const getAtheleteActivities = async () => {
  const { athlete, accessToken } = await getAccessToken()

  let totalActivites = [];
  let activities = []
  let page = 1;

  if (fileExists(athlete.firstname)) {
    console.log('getting file')
    totalActivites = readFile(athlete.firstname)
  }
  else {
    console.log('making requests')
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
    writeFile(athlete.firstname.toLowerCase(), totalActivites)
  }

  getReducedGearIds(totalActivites)

  return totalActivites
}



export { getAtheleteActivities }