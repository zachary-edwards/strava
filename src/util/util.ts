const getReducedGearIds = (totalActivites: Array<any>) => {
  const gearIds = []
  const reducedGearIds = totalActivites.map(activity => activity.gear_id)

  reducedGearIds.forEach(gearId => {
    if (!gearIds.includes(gearId) && gearId)
      gearIds.push(gearId)
  })

  gearIds.forEach(gearId => {
    let activitiesPerGearId = totalActivites.filter(activity => activity.gear_id === gearId)
    let movingTime = activitiesPerGearId.reduce((a, b) => a + b.moving_time, 0)
    console.log('Moving time?', movingTime, 'GearId', gearId)
  })
}


export { getReducedGearIds }