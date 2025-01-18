import { Request, Response } from "express";
import { URLBody, URLLog, URLResponse } from "../types";
import { BaseController } from "./BaseController";
import { URLShortenerQueries } from "../utils/queries/URLShortenerQueries";
import { randomBytes } from 'crypto';
import { UAParser } from 'ua-parser-js';
import { redisClient } from "../services/RedisClient";

export class URLShortenerController extends BaseController {
    private readonly urlShortenerQueries: URLShortenerQueries;

    constructor() {
        super();
        this.urlShortenerQueries = new URLShortenerQueries();
    }

    async createShortURL(req: Request, res: Response) {
        try {
            const user = req.user;
            const urlBody = new URLBody(req.body);

            if (!urlBody.topic) {
                urlBody.topic = "NA";
            }

            if (!urlBody.custom_alias) {
                urlBody.custom_alias = this.generateBase62Alias();
            } else if (urlBody.custom_alias.length !== 6) {
                return res.status(400).json({ message: "Alias length should be 6." });
            }

            const checkExistingAlias = await this.urlShortenerQueries.execCheckExistingAlias(urlBody.custom_alias);
            if (checkExistingAlias.length > 0) {
                return res.status(400).json({ message: "Alias already exists" });
            }

            const urlResponse = new URLResponse();

            const checkExistingLongUrl = await this.urlShortenerQueries.execCheckExistingUrl(urlBody.long_url);
            if (checkExistingLongUrl.length > 0) {
                const values = this.getValues(checkExistingLongUrl);
                urlResponse.url_id = parseInt(values[0]);
                urlResponse.long_url = values[1];
                urlResponse.short_url = process.env.SHORT_URL_PREFIX + values[2];
                return res.status(200).json(urlResponse);
            }

            const result = await this.urlShortenerQueries.execInsertShortURL(user.user_id, urlBody);
            const values = this.getValues(result);

            urlResponse.url_id = parseInt(values[0]);
            urlResponse.long_url = values[1];
            urlResponse.short_url = process.env.SHORT_URL_PREFIX + values[2];

            return res.status(201).json(urlResponse);
        } catch (error) {
            console.error("Error creating short URL:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async redirectToLongURL(req: Request, res: Response) {
        try {
            const { alias } = req.params;
            if (!alias || alias.length !== 6) {
                return res.status(400).json({ message: "Alias must be 6 characters long" });
            }

            const cachedLongUrlObject = await redisClient.getValue(alias);
            let longUrl: string;
            let urlId: string;
            if (cachedLongUrlObject) {
                const cachedObject = JSON.parse(cachedLongUrlObject) as { id: string, long_url: string };
                urlId = cachedObject.id;
                longUrl = cachedObject.long_url;
            } else {
                const fetchLongURL = await this.urlShortenerQueries.execGetLongURL(alias);
                if (!fetchLongURL.length) {
                    return res.status(404).json({ message: "Alias does not exist" });
                }

                const urlValues: string[] = this.getValues(fetchLongURL);
                urlId = urlValues[0];
                longUrl = urlValues[1];

                await redisClient.setKey(alias, urlId, longUrl);
            }

            let ip = req.ip!;
            const ua = req.headers['user-agent'];
            const parser = new UAParser(ua);
            const { device, os } = parser.getResult();
            const urlLog = new URLLog();

            if (ip.startsWith('::ffff:')) {
                ip = ip.substring(7);
            }

            urlLog.url_id = parseInt(urlId);
            urlLog.requester_device = device.type ?? "desktop";
            urlLog.requester_ip = ip as string;
            urlLog.requester_os = os.name ?? "unknown";

            await this.urlShortenerQueries.execEnterFetchLog(urlLog);

            return res.status(301).json({ url_id: urlId, long_url: longUrl });
        } catch (error) {
            console.error("Error redirecting to long URL:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    private generateBase62Alias(): string {
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const randomBuffer = randomBytes(3);
        let randomNumber = randomBuffer.readUIntBE(0, 3);
        let result = "";
        while (randomNumber > 0) {
            const remainder = randomNumber % 62;
            result = characters.charAt(remainder) + result;
            randomNumber = Math.floor(randomNumber / 62);
        }
        return result.padStart(6, '0').slice(0, 6);
    }
}
