const envFile = process.env.ENV_FILE || '.env';
import {config as dotenv} from 'dotenv';
dotenv({path: __dirname + `/../${envFile}`});

import init from './init';
import {createConnection, getRepository} from "typeorm";
import dbConfig from './database/config';
console.log(dbConfig);
createConnection(dbConfig).then(async connection => {
    init();
}).catch(err => {
    console.log('error: ', err);
});