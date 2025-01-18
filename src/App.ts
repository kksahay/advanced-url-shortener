import express, { Application } from "express";
import cors from "cors";
import { RouterMW, routers } from "./routes";
import fs from "fs";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";
import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit'

export class App {
    private readonly app: Application = express();
    private file: string;
    private swaggerDocument: any;
    private rateLimiter: RateLimitRequestHandler;

    constructor(private readonly PORT: string) {
        this.rateLimiter = rateLimit({
            windowMs: 60 * 1000,
            limit: 50,
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.file = fs.readFileSync("swagger.yaml", 'utf8');
        this.swaggerDocument = YAML.parse(this.file);
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(this.rateLimiter);
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