const getReducedGearIds = (totalActivites: Array<any>) => {
  const gearIds = []
  const reducedGearIds = totalActivites.map(activity => activity.gear_id)

  reducedGearIds.forEach(gearId => {
    if (!gearIds.includes(gearId) && gearId)
      gearIds.push(gearId)
  })
  
  return gearIds
}

function secondsToDhms(epoch) {
  epoch = Number(epoch);
  var days = Math.floor(epoch / (3600*24));
  var hours = Math.floor(epoch % (3600*24) / 3600);
  var minutes = Math.floor(epoch % 3600 / 60);
  var seconds = Math.floor(epoch % 60);
  
  if (days > 0)
    hours += days*24
  var hDisplay = hours > 0 ? hours + (hours == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = minutes > 0 ? minutes + (minutes == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = seconds > 0 ? seconds + (seconds == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
  }

const convertToEST = (date: Date) => date.toLocaleString('en-US', { timeZone: 'America/New_York' });

export { getReducedGearIds, secondsToDhms, convertToEST }