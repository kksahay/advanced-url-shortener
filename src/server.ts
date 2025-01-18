import { App } from "./App";
import { DatabaseConnection } from "./configs/DatabaseConnection";
import { User } from "./types";

declare module "express-serve-static-core" {
    interface Request {
        user: User;
    }
}



const db = new DatabaseConnection();
const app = new App(process.env.PORT as string);
export const sql = db.sql;

db.checkConnection()
    .then(() => {
        app.listen();
    })
    .catch((error) => {
        console.log(error);
    });