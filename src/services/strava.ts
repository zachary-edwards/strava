import axios, { AxiosResponse } from 'axios'
import { AtheleteTokenRequest } from '../models/accessTokenRequest';
import { ACCESS_TOKEN } from '../server';
import { getReducedGearIds, secondsToDhms } from '../util/util';
import { fileExists, readFile, writeFile } from './filehelper';
import { getAccessToken } from './stravaAuthenticator';

const url = "https://www.strava.com/api/v3";
let gearIds = []


const getGearData = async (athlete, accessToken, gearIds) => {
  try {
    const gearData = []
    for (const gearId in gearIds) {
      var res = await axios(`${url}/gear/${gearIds[gearId]}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
      gearData.push(res.data)
    }
    return gearData
  }
  catch (err) {
    console.error('Error getting gear data', err)
  }
}

const getAtheleteActivities = async () => {
  const { athlete, access_token } = ACCESS_TOKEN;

  let totalActivites = [];
  let activities = []
  let page = 1;

  // if (fileExists(athlete.firstname)) {
  //   console.log('getting file')
  //   totalActivites = readFile(athlete.firstname)
  // }
  // else {
    console.log('making requests')
    do {
      console.log("uhoh", access_token)
      var res = await axios(`${url}/athlete/activities?page=${page}&per_page=30`, {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      }).catch((err) => console.error(err))
      console.log(res)
      activities = res && res.data
      totalActivites.push(activities)
      page++;
    }
    while (page < 50 && activities.length === 30)
    totalActivites = totalActivites.flat()
    writeFile(athlete.firstname, totalActivites)


  gearIds = getReducedGearIds(totalActivites)

  await writeFile(`${athlete.firstname}-gear`, gearIds)
  const gearData = await getGearData(athlete, access_token, gearIds)
  let dataToReturn = []

  gearIds.forEach(gearId => {
    let gearDetails = gearData.filter(gearDetail => gearDetail.id === gearId)[0]
    let activitiesPerGearId = totalActivites.filter(activity => activity.gear_id === gearId)
    let movingTime = activitiesPerGearId.reduce((a, b) => a + b.moving_time, 0)
    let distance = (gearDetails.distance * 3.28084) / 5280
    dataToReturn.push({gearName: gearDetails.name, distance: `${distance} miles`, movingTime: secondsToDhms(movingTime)})
  })

  return dataToReturn
}

export { getAtheleteActivities, getGearData }