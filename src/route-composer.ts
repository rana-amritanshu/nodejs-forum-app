import fs from 'fs';
import {Application, Router} from 'express';

interface AppRoutes {[key: string]: Router};
let routes: AppRoutes = {};
let items = fs.readdirSync(__dirname + '/app');

items.forEach((dir: string) => {
    routes[dir] = require(`./app/${dir}/routes`).router
    routes[dir] = routes[dir];
});

export default (app: Application): void => {
    for(let dir in routes) {
        app.use(`/api/${dir}`, routes[dir]);
    }
}

