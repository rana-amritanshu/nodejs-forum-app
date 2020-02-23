import {ConnectionOptions} from 'typeorm'
import fs from 'fs'

let files = fs.readdirSync(__dirname + "/entities")

files = files.filter(file => file.includes(".ts")).map(file => file.replace(".ts", ""))

const entities: any  = []
files.forEach(file => {
    entities.push(require(`./entities/${file}`).entity)
})

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