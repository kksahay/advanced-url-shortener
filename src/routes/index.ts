import { Router } from "express";
import userRoute from "./userRoute";
import analyticsRoute from "./analyticsRoute";
import urlShorenerRoute from "./urlShortenerRoute";

export interface RouterMW {
    path: string;
    router: Router;
}

export const routers: RouterMW[] = [
    { path: "/api", router: userRoute },
    { path: "/api/analytics", router: analyticsRoute },
    { path: "/api/shorten", router: urlShorenerRoute },
]