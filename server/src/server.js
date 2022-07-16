const http = require('http');
require('dotenv').config();
const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const PORT = process.env.PORT || 8000;
console.log(PORT);
const server = http.createServer(app);
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');

async function startServer(){
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchData();
    server.listen(PORT, ()=>{
        console.log(`listening port is ${PORT}.......`);
    });
}
startServer();

