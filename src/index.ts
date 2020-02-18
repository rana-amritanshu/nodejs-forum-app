import {config as dotenv} from 'dotenv'
dotenv();

import init from './init';
import {createConnection, getRepository} from "typeorm";
import dbConfig from './database/config';

createConnection(dbConfig).then(async connection => {
    init();
}).catch(err => {
    console.log('error: ', err);
});