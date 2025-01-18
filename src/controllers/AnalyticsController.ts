import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { AnalyticsQueries } from "../utils/queries/AnalyticsQueries";
import { ClicksByDate, DeviceType, OSType, URLAnalytics, URLs } from "../types";
import { URLShortenerQueries } from "../utils/queries/URLShortenerQueries";

export class AnalyticsController extends BaseController {
    private readonly analyticsQueries: AnalyticsQueries;
    private readonly urlShortenerQueries: URLShortenerQueries;

    constructor() {
        super();
        this.analyticsQueries = new AnalyticsQueries();
        this.urlShortenerQueries = new URLShortenerQueries();
    }

    async getAliasAnalytics(req: Request, res: Response): Promise<Response> {
        try {
            const { alias } = req.params;
            if (!alias || alias.length !== 6) {
                return res.status(400).json({ message: "Alias must be 6 characters long" });
            }
            const checkExistingAlias = await this.urlShortenerQueries.execCheckExistingAlias(alias);
            if (!checkExistingAlias.length) {
                return res.status(400).json({ message: "Alias does not exists" });
            }
            const urlId = this.getValues(await this.analyticsQueries.execGetAliasId(alias))[0];
            const aliasAnalytics = new URLAnalytics();
            const totalClicks = this.getValues(await this.analyticsQueries.execGetTotalClicksByAlias(parseInt(urlId)));
            const uniqueClicks = this.getValues(await this.analyticsQueries.execGetUniqueClicksByAlias(parseInt(urlId)));
            const clicksByDate = await this.analyticsQueries.execGetClicksByDate(parseInt(urlId)) as ClicksByDate[];
            const clicksByOSType = await this.analyticsQueries.execGetOSType(parseInt(urlId)) as OSType[];
            const clicksByDeviceType = await this.analyticsQueries.execGetDeviceType(parseInt(urlId)) as DeviceType[];

            aliasAnalytics.total_clicks = parseInt(totalClicks[0] as string);
            aliasAnalytics.unique_clicks = parseInt(uniqueClicks[0] as string);
            aliasAnalytics.clicks_by_date = clicksByDate;
            aliasAnalytics.os_type = clicksByOSType;
            aliasAnalytics.device_type = clicksByDeviceType;

            return res.status(200).json(aliasAnalytics);

        } catch (error: any) {
            return res.status(400).json({ message: error.message })
        }
    }

    async getTopicAnalytics(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user;
            const { topic } = req.params;
            if (!topic) {
                return res.status(400).json({ message: "Topic must be provided" });
            }

            const checkTopic = await this.analyticsQueries.execCheckTopic(topic);
            if(!checkTopic.length) {
                return res.status(400).json({ message: "Topic does not exists" });
            }

            const topicAnalytics = new URLAnalytics();
            const totalClicks = this.getValues(await this.analyticsQueries.execGetTotalClicksByTopic(topic, user.user_id));
            const uniqueUsers = this.getValues(await this.analyticsQueries.execGetUniqueUsersByTopic(topic, user.user_id));
            const clicksByDate = await this.analyticsQueries.execGetTopicClicksByDate(topic, user.user_id) as ClicksByDate[];
            const urls = await this.analyticsQueries.execGetUrlsByTopic(topic, user.user_id) as URLs[];

            topicAnalytics.total_clicks = parseInt(totalClicks[0] as string);
            topicAnalytics.unique_clicks = parseInt(uniqueUsers[0] as string);
            topicAnalytics.clicks_by_date = clicksByDate;
            topicAnalytics.urls = urls;

            return res.status(200).json(topicAnalytics);

        } catch (error: any) {
            return res.status(400).json({ message: error.message })
        }
    }

    async getOverallAnalytics(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user;

            const overAllAnalytics = new URLAnalytics();

            const totalUrls = this.getValues(await this.analyticsQueries.execGetTotalUrls(user.user_id));
            const totalClicks = this.getValues(await this.analyticsQueries.execGetTotalClicks(user.user_id));
            const uniqueUsers = this.getValues(await this.analyticsQueries.execGetTotalUniqueUsers(user.user_id));
            const clicksByDate = await this.analyticsQueries.execGetTotalClicsByDate(user.user_id) as ClicksByDate[];
            const clicksByOSType = await this.analyticsQueries.execGetTotalOSType(user.user_id) as OSType[];
            const clicksByDeviceType = await this.analyticsQueries.execGetTotalDeviceType(user.user_id) as DeviceType[];

            overAllAnalytics.total_urls = parseInt(totalUrls[0] as string);
            overAllAnalytics.total_clicks = parseInt(totalClicks[0] as string);
            overAllAnalytics.unique_clicks = parseInt(uniqueUsers[0] as string);
            overAllAnalytics.clicks_by_date = clicksByDate;
            overAllAnalytics.os_type = clicksByOSType;
            overAllAnalytics.device_type = clicksByDeviceType;

            return res.status(200).json(overAllAnalytics);

        } catch (error: any) {
            return res.status(400).json({ message: error.message })
        }
    }
}