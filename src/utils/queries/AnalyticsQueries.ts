import { sql } from "../../server";

export class AnalyticsQueries {
    async execGetAliasId(alias: string): Promise<unknown[]> {
        const response = sql`
            SELECT 
                url_id 
            FROM 
                public.tblUrl
            WHERE 
                short_url = ${alias}
        `;
        return response;
    }

    async execGetTotalClicksByAlias(urlId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                COUNT(log_id) 
            FROM 
                public.tblUrlLog
            WHERE 
                url_id = ${urlId}
        `;
        return response;
    }

    async execGetUniqueClicksByAlias(urlId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                COUNT(DISTINCT(requester_ip)) 
            FROM 
                public.tblUrlLog
            WHERE 
                url_id = ${urlId}
        `;
        return response;
    }

    async execGetClicksByDate(urlId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                requester_time AS date,
                COUNT(log_id) AS click_count 
            FROM 
                public.tblUrlLog
            WHERE 
                url_id = ${urlId} AND 
                requester_time >= NOW() - INTERVAL '7 days'
            GROUP BY 
                requester_time
        `;
        return response;
    }

    async execGetOSType(urlId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                requester_os AS os_name, 
                COUNT(DISTINCT(requester_ip)) AS unique_clicks, 
                COUNT(DISTINCT(requester_ip)) AS unique_users
            FROM 
                public.tblUrlLog 
            WHERE 
                url_id = ${urlId}
            GROUP BY 
                requester_os
        `;
        return response;
    }

    async execGetDeviceType(urlId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                requester_device AS device_name, 
                COUNT(DISTINCT(requester_ip)) AS unique_clicks, 
                COUNT(DISTINCT(requester_ip)) AS unique_users
            FROM 
                public.tblUrlLog WHERE url_id = ${urlId}
            GROUP BY 
                requester_device
        `;
        return response;
    }

    async execCheckTopic(topic: string): Promise<unknown[]> {
        const response = sql`
            SELECT 
                topic 
            FROM
                public.tblUrl
            WHERE
                topic = ${topic}
        `;
        return response;
    }

    async execGetTotalClicksByTopic(topic: string, userId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                COUNT(tlog.log_id) AS total_clicks
            FROM
                public.tblUrl t INNER JOIN
                public.tblUrlLog tlog 
                ON t.url_id = tlog.url_id
            WHERE
                t.topic = ${topic} AND
                t.created_by = ${userId}
        `;
        return response;
    }

    async execGetUniqueUsersByTopic(topic: string, userId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                COUNT(DISTINCT(tlog.requester_ip)) AS unique_clicks
            FROM
                public.tblUrl t INNER JOIN
                public.tblUrlLog tlog 
                ON t.url_id = tlog.url_id
            WHERE
                t.topic = ${topic} AND
                t.created_by = ${userId}
        `;
        return response;
    }

    async execGetTopicClicksByDate(topic: string, userId: number): Promise<unknown[]> {
        const response = sql`
            SELECT
                tlog.requester_time AS date,
                COUNT(tlog.log_id) AS click_count
            FROM
                public.tblUrl t INNER JOIN
                public.tblUrlLog tlog
                ON t.url_id = tlog.url_id
            WHERE
                t.topic = ${topic} AND
                t.created_by = ${userId} AND
                tlog.requester_time >= NOW() - INTERVAL '7 days'
            GROUP BY
                tlog.requester_time
        `;
        return response;
    }

    async execGetUrlsByTopic(topic: string, userId: number): Promise<unknown[]> {
        const response = sql`
            SELECT
                COUNT(DISTINCT(t.short_url)) AS short_url,
                COUNT(tlog.requester_ip) AS total_clicks,
                COUNT(DISTINCT(tlog.requester_ip)) AS unique_users
            FROM
                public.tblUrl t INNER JOIN
                public.tblUrlLog tlog
                ON t.url_id = tlog.url_id
            WHERE
                t.topic = ${topic} AND
                t.created_by = ${userId}
        `;
        return response;
    }

    async execGetTotalUrls(userId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                COUNT(DISTINCT(short_url))
            FROM
                public.tblUrl
            WHERE
                created_by = ${userId}
        `;
        return response;
    }

    async execGetTotalClicks(userId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                COUNT(tlog.log_id)
            FROM
                public.tblUrl t INNER JOIN
                public.tblUrlLog tlog
                ON t.url_id = tlog.url_id
            WHERE
                t.created_by = ${userId}
        `;
        return response;
    }

    async execGetTotalUniqueUsers(userId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                COUNT(DISTINCT(tlog.requester_ip))
            FROM
                public.tblUrl t INNER JOIN
                public.tblUrlLog tlog
                ON t.url_id = tlog.url_id
            WHERE
                t.created_by = ${userId}
        `;
        return response;
    }

    async execGetTotalClicsByDate(userId: number): Promise<unknown[]> {
        const response = sql`
            SELECT
                tlog.requester_time AS date,
                COUNT(tlog.log_id) AS click_count
            FROM
                public.tblUrl t INNER JOIN
                public.tblUrlLog tlog
                ON t.url_id = tlog.url_id
            WHERE
                t.created_by = ${userId} AND
                tlog.requester_time >= NOW() - INTERVAL '7 days'
            GROUP BY
                tlog.requester_time
        `;
        return response;
    }

    async execGetTotalOSType(userId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                tlog.requester_os AS os_name, 
                COUNT(DISTINCT(tlog.requester_ip)) AS unique_clicks, 
                COUNT(DISTINCT(tlog.requester_ip)) AS unique_users
            FROM 
                public.tblUrl t INNER JOIN
                public.tblUrlLog tlog
                ON t.url_id = tlog.url_id
            WHERE 
                t.created_by = ${userId}
            GROUP BY 
                requester_os
        `;
        return response;
    }

    async execGetTotalDeviceType(userId: number): Promise<unknown[]> {
        const response = sql`
            SELECT 
                tlog.requester_device AS device_name, 
                COUNT(DISTINCT(tlog.requester_ip)) AS unique_clicks, 
                COUNT(DISTINCT(tlog.requester_ip)) AS unique_users
            FROM 
                public.tblUrl t INNER JOIN
                public.tblUrlLog tlog
                ON t.url_id = tlog.url_id
            WHERE 
                t.created_by = ${userId}
            GROUP BY 
                requester_device
        `;
        return response;
    }
}