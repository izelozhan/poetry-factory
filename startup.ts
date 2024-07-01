import service from "./app/api/service";
const dotenv = require('dotenv');
const path = require('path');
const envFile = path.resolve(__dirname, '.env.local');
dotenv.config({ path: envFile });


console.log('starting');
(async () => {
    //creates collection and loads data
    service.startup();
    console.log('done');
})();