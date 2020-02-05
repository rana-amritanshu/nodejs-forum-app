import express from 'express'
import {config as dotenv} from 'dotenv'
import routes from './route-composer'

dotenv()
const app = express();
routes(app)

app.listen(8000, () => {
    console.log(`Server started`);
})