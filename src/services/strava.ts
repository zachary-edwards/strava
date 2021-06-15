import axios, { AxiosResponse } from 'axios'
import { AtheleteTokenRequest } from '../models/accessTokenRequest';
import { getReducedGearIds } from '../util/util';
import { fileExists, readFile, writeFile } from './filehelper';
import { getAccessToken } from './stravaAuthenticator';

const url = "https://www.strava.com/api/v3";
let gearIds = []

const getAthelete = async () => {
  await getAccessToken()

}

const getGearData = async () => {
  try {
    const { athlete, accessToken } = await getAccessToken()
    if (!fileExists(`${athlete.firstname}-gear`)) {
      console.log('no file for athlete')
      return;
    }

    const gearIds: string[] = readFile(`${athlete.firstname}-gear`)
    gearIds.forEach(async gearId => {
      var res = await axios(`${url}/gear/${gearId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      console.log(res.data)
    })
  }
  catch (err) {
    console.error('Error getting gear data', err)
  }
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
    writeFile(athlete.firstname, totalActivites)
  }

  gearIds = getReducedGearIds(totalActivites)

  gearIds.forEach(gearId => {
    let activitiesPerGearId = totalActivites.filter(activity => activity.gear_id === gearId)
    let movingTime = activitiesPerGearId.reduce((a, b) => a + b.moving_time, 0)
    console.log('Moving time?', movingTime, 'GearId', gearId)
  })

  writeFile(`${athlete.firstname}-gear`, gearIds)
  return totalActivites
}

export { getAtheleteActivities, getGearData }