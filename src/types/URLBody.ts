export class URLBody {
    long_url!: string;
    custom_alias!: string;
    topic!: string;

    constructor(data?: Partial<URLBody>) {
        Object.assign(this, data);
    }
}