import fs from 'fs';
import {Application, Router} from 'express';
const pluralize = require('pluralize');

interface AppRoutes {[key: string]: Router};
let routes: AppRoutes = {};
let items = fs.readdirSync(__dirname + '/app');

items.forEach((dir: string) => {
    let pluralDir = pluralize(dir);
    routes[pluralDir] = require(`./app/${dir}/routes`).router
});

export default (app: Application): void => {
    for(let dir in routes) {
        app.use(`/api/${dir}`, routes[dir]);
    }
}

