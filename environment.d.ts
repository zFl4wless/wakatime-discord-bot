declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Bot
            BOT_TOKEN: string;
            GUILD_ID: string;
            ENVIRONMENT: 'dev' | 'prod' | 'test';

            // API
            API_URL: string;
            API_PORT: number;

            // Database
            DATEBASE_URL: string;

            // WakaTime Client Credentials
            CLIENT_ID: string;
            CLIENT_SECRET: string;
        }
    }
}

export {};
