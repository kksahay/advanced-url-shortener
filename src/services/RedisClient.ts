import { createClient, RedisClientType } from 'redis';

export class RedisClient {
    private readonly redisClient: RedisClientType;

    constructor() {
        this.redisClient = createClient({
            url: process.env.REDIS_URI
        });
        this.initialize();
    }

    private async initialize() {
        this.redisClient.on('connect', async () => {
            console.log('Redis connected successfully');
            await this.redisClient.connect();
        });

        this.redisClient.on('error', async (error) => {
            console.error('Redis connection failed', error);
            await this.redisClient.disconnect();
        });
    }

    isLive(): boolean {
        return this.redisClient.isReady;
    }
}