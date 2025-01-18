import { URLShortenerController } from "./URLShortenerController";
import { UserController } from "./UserController";

const userController = new UserController();
const urlShortenerController = new URLShortenerController();

export {
    userController,
    urlShortenerController
}