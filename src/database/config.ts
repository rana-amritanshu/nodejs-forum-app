import {ConnectionOptions} from 'typeorm'
import fs from 'fs'

const environment: string = <string>process.env.ENVIRONMENT || 'dev';
const codeFileExtension: string = environment === 'dev' ? '.ts' : '.js';
let files = fs.readdirSync(__dirname + "/entities")

files = files.filter(file => file.includes(codeFileExtension)).map(file => file.replace(".ts", ""))

const entities: any  = []
files.forEach(file => {
    entities.push(require(`./entities/${file}`).entity)
})
// console.log(process.env.DB_HOST);
const dbConfig: any = {
    name: "default",
    host: process.env.DB_HOST,
    type: "mysql",
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: entities,
    logging: ["query", "error"]
};

export default dbConfig;