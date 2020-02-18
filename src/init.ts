import 'reflect-metadata';
import express from 'express';
import routes from './route-composer';
import {json, urlencoded} from 'body-parser'

export default () => {
    const app = express();
    app.use(json());
    app.use(urlencoded({extended: false}));
    routes(app);

    app.listen(8000, () => {
        console.log(`Server started`);
    });
};
