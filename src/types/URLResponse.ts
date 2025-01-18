export class URLResponse {
    url_id!: number;
    long_url!: string;
    short_url!: string;

    constructor(data?: Partial<URLResponse>) {
        Object.assign(this, data);
    }
}