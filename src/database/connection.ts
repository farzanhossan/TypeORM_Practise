import {createConnection} from "typeorm";

const connection = () =>{
    createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "TypeORM_Test",
    entities: [
        "src/entity/**/*.ts"
    ],
    synchronize: true,
    logging: ["log",'query']
}).then(connection => {
    console.log('Database Connected');
}).catch(error => console.log(error));
}

export default connection;
