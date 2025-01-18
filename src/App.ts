import express, { Application } from "express";
import cors from "cors";
import { RouterMW, routers } from "./routes";
import fs from "fs";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";

export class App {
    private readonly app: Application = express();
    private file: string;
    private swaggerDocument: any;

    constructor(private readonly PORT: string) {
        this.file = fs.readFileSync("swagger.yaml", 'utf8');
        this.swaggerDocument = YAML.parse(this.file);
        this.app.use(express.json());
        this.app.use(cors());
        this.routes();  
    }

    private routes() {
        routers.forEach((router: RouterMW) => {
            this.app.use(router.path, router.router);
        });
        this.app.use('/', swaggerUi.serve, swaggerUi.setup(this.swaggerDocument));
    }

    public listen() {
        this.app.listen(this.PORT, () => {
            console.log(`Server is running on Port: ${this.PORT}`);
        });
    }
}