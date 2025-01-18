export class ClicksByDate {
    date!: Date;
    click_count!: number;
}

export class OSType {
    os_name!: string;
    unique_clicks!: number;
    unique_users!: number;
}

export class DeviceType {
    device_name!: string;
    unique_clicks!: number;
    unique_users!: number;
}

export class URLs {
    short_url!: string;
    total_clicks!: number;
    unique_users!: number;
}

export class URLAnalytics {
    total_urls!: number;
    total_clicks!: number;
    unique_clicks!: number;
    clicks_by_date!: ClicksByDate[];
    os_type!: OSType[];
    device_type!: DeviceType[];
    urls!: URLs[];

    constructor(data?: Partial<URLAnalytics>) {
        Object.assign(this, data);
    }
}