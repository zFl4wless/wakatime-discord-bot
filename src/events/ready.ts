import { logger } from '..';
import { prismaClient } from '../db/prisma';
import { Event } from '../structure/Event';

/**
 * This event is emitted when the bot is ready and used as an example for creating events.
 */
export default new Event('ready', () => {
    prismaClient.$connect();

    logger.info('Bot is ready!');
});
