export class URLLog {
    url_id!: number;
    requester_ip!: string;
    requester_os!: string;
    requester_device!: string;

    constructor(data?: Partial<URLLog>) {
        Object.assign(this, data);
    }
}