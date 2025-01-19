import { createClient, RedisClientType } from 'redis';

export class RedisClient {
    private readonly redisClient: RedisClientType;

    constructor() {
        this.redisClient = createClient({
            socket: {
                host: "redis",
                port: 6379,
            }
        });
        this.initialize();
    }

    private async initialize() {
        this.redisClient.on("error", async (err: string) => {
            console.log("Could not establish a connection with redis. " + err)
            await this.redisClient.disconnect();
        });

        this.redisClient.on("connect", () => {
            console.log("Connected to redis successfully");
        });
        await this.redisClient.connect();
    }

    async setKey(short_url: string, id: string, long_url: string): Promise<void> {
        try {
            await this.redisClient.set(short_url, JSON.stringify({ id, long_url }));
            await this.setExpiry(short_url);
        } catch (error) {
            console.log(error);
        }
    }

    async getValue(short_url: string): Promise<string | null> {
        try {
            const long_url = await this.redisClient.get(short_url);
            return long_url;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    public isLive(): boolean {
        return this.redisClient.isReady;
    }

    private async setExpiry(short_url: string): Promise<void> {
        try {
            await this.redisClient.expire(short_url, 30 * 24 * 60 * 60);
        } catch (error) {
            console.log(error);
        }
    }
}

export const redisClient = new RedisClient();