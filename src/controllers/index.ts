import { AnalyticsController } from "./AnalyticsController";
import { URLShortenerController } from "./URLShortenerController";
import { UserController } from "./UserController";

const userController = new UserController();
const urlShortenerController = new URLShortenerController();
const analyticsController = new AnalyticsController();

export {
    userController,
    urlShortenerController,
    analyticsController
}