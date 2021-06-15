const getReducedGearIds = (totalActivites: Array<any>) => {
  const gearIds = []
  const reducedGearIds = totalActivites.map(activity => activity.gear_id)

  reducedGearIds.forEach(gearId => {
    if (!gearIds.includes(gearId) && gearId)
      gearIds.push(gearId)
  })
  
  return gearIds
}

function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600*24));
  var h = Math.floor(seconds % (3600*24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  
  if (d > 0)
    h += d*24
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
  }


export { getReducedGearIds, secondsToDhms }