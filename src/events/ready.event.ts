import { ActivityType } from 'discord.js';
import { client, logger } from '..';
import { prismaClient } from '../db/prisma';
import { Event } from '../structure/Event';

/**
 * This event is emitted when the bot is ready and used as an example for creating events.
 */
export default new Event('clientReady', () => {
    prismaClient.$connect();

    client.user.setPresence({
        activities: [
            {
                name: 'with WakaTime',
                type: ActivityType.Playing,
            },
        ],
        status: 'online',
    });

    logger.info('Bot is ready!');
});
