import {config as dotenv} from 'dotenv'
dotenv();

import express from 'express'
import 'reflect-metadata'
import routes from './route-composer'
import {createConnection, getRepository} from "typeorm";
import dbConfig from './database/config'

createConnection(dbConfig).then(async connection => {
    const app = express();
    routes(app);

    app.listen(8000, () => {
        console.log(`Server started`);
    })

}).catch(err => {
    console.log('error: ', err);
})