import { URLLog } from './../../types/URLLog';
import { sql } from "../../server";
import { URLBody } from "../../types";

export class URLShortenerQueries {

    async execCheckExistingAlias(alias: string): Promise<unknown[]> {
        const response = await sql`
            SELECT short_url FROM public.tblURL
            WHERE short_url = ${alias}
        `;
        return response;
    }

    async execCheckExistingUrl(long_url: string): Promise<unknown[]> {
        const response = await sql`
            SELECT url_id, long_url, short_url, created_by FROM public.tblURL
            WHERE long_url = ${long_url}
        `;
        return response;
    }

    async execInsertShortURL(user_id: number, urlBody: URLBody): Promise<unknown[]> {
        const response = await sql`
            INSERT INTO public.tblURL (long_url, short_url, topic, created_by, created_time)
            VALUES (${urlBody.long_url}, ${urlBody.custom_alias}, ${urlBody.topic}, ${user_id}, NOW())
            RETURNING url_id, long_url, short_url
        `;
        return response;
    }

    async execGetLongURL(alias: string): Promise<unknown[]> {
        const response = await sql`
            SELECT url_id, long_url FROM public.tblURL
            WHERE short_url = ${alias}
        `;
        return response;
    }

    async execEnterFetchLog(urlLog: URLLog): Promise<void> {
        await sql`
            INSERT INTO public.tblUrlLog (url_id, requester_ip, requester_time, requester_os, requester_device)
            VALUES (${urlLog.url_id}, ${urlLog.requester_ip}, NOW(), ${urlLog.requester_os}, ${urlLog.requester_device})
        `
    }
}