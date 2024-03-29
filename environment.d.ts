declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Bot
            BOT_TOKEN: string;
            GUILD_ID: string;

            // API
            API_URL: string;
            API_PORT: number;

            // Database
            DATABASE_URL: string;

            // WakaTime Client Credentials
            CLIENT_ID: string;
            CLIENT_SECRET: string;

            // Crypto
            CRYPTO_PASSWORD: string;
        }
    }
}

export {};
