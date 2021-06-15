const getReducedGearIds = (totalActivites: Array<any>) => {
  const gearIds = []
  const reducedGearIds = totalActivites.map(activity => activity.gear_id)

  reducedGearIds.forEach(gearId => {
    if (!gearIds.includes(gearId) && gearId)
      gearIds.push(gearId)
  })
  
  return gearIds
}


export { getReducedGearIds }