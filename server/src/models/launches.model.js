const axios = require('axios');
const launchesDatabase = require('./launchaes.mongo');
const planets = require('./planets.mongo');
let DEFAULT_FLIGHT_NUMBER =100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunchData(){
    console.log("Downloading launch data......");
    const response = await axios.post(SPACEX_API_URL, {
      query: {},
      options: {
          pagination: false,
          populate: [
              {
                path:'rocket',
                select: {
                  name: 1
                }
              },
              {
                path:'payloads',
                select: {
                  customers:1
                }
              }
          ]
      }
  });
    if(response.status !== 200){
        console.log('Problem dowloading launch data');
        throw new Error('Launch data download failed');
    }
     const launchDocs = response.data.docs;
     
     for(const launchDoc of launchDocs){
      const payLoads = launchDoc['payloads'];
      const customers = payLoads.flatMap((payLoad) =>{
             return payLoad['customers'];
      });
      const launch = {
          flightNumber : launchDoc['flight_number'],
          mission:launchDoc['name'],
          rocket:launchDoc['rocket']['name'],
          lauchDate:launchDoc['date_local'],
          customers: customers,
          upcoming:launchDoc['upcoming'],
          success:launchDoc['success']
       }
       console.log(`flight: ${launch.flightNumber} mission: ${launch.mission}`);
       await saveLaunch(launch);  
    }
}
async function loadLaunchData(){
    const firstLaunch = await findLaunch({
     flightNumber:1,
     mission:'falconSat sssss',
     rocket:'falcon sss 1 '
    });
    
    if(!firstLaunch){
        await populateLaunchData(); 
        //console.log("Launch data not downloaded"); 
    }else{
        console.log("Launch data already downloaded");
    }
}
async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}
async function existsLaunchWithId(launchId){
    return await findLaunch({
        flightNumber : launchId
    });
}
async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase.findOne()
    .sort('-flightNumber');
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}
async function getAllLaunches(skip, limit){
    //return Array.from(launches.values());
    return await launchesDatabase.find({},{ '_id':0, '__v':0})
    .sort({ flightNumber : 1})
    .skip(skip)
    .limit(limit);
}
async function saveLaunch(launch){
    
    await launchesDatabase.findOneAndUpdate({ 
        flightNumber: launch.flightNumber },
        launch,
        { upsert:true});
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName:launch.target
    });
    if(!planet){
        throw new Error("No matching planet was found");
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        flightNumber:newFlightNumber,
        customers:['Zero To Mastery', 'NASA'],
        upcoming:true,
        success:true 
    });
    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId){
   const abortedLaunch = await launchesDatabase.updateOne(
       { flightNumber: launchId },
       { upcoming: false, success: false});
   return abortedLaunch.matchedCount === 1;
}
module.exports = { existsLaunchWithId, getAllLaunches, scheduleNewLaunch, abortLaunchById, loadLaunchData };