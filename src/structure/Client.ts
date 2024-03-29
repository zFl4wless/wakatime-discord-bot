import { ApplicationCommandDataResolvable, Client, Collection } from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';
import { RegisterCommandsOptions } from '../types/core/Client';
import { logger } from '..';
import { CommandType } from '../types/core/Command';
import path from 'path';

const globPromise = promisify(glob);

/**
 * The extended client.
 * @extends {Client} The discord.js client.
 * @property {Collection<string, CommandType>} commands The commands.
 */
export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({ intents: 32767 });
    }

    /**
     * Starts the client.
     */
    start() {
        this.registerModules();
        this.login(process.env.BOT_TOKEN);
    }

    /**
     * Imports a file.
     *
     * @param filePath The path to the file.
     * @returns The default export of the file.
     */
    async importFile(filePath: string) {
        return (await import(filePath)).default;
    }

    /**
     * Registers commands.
     *
     * @param options The options for registering commands.
     * @param options.commands The commands to register.
     * @param options.guildId The guild id to register the commands in.
     */
    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            await this.guilds.cache.get(guildId)?.commands.set(commands);
            logger.info(`Registering commands to ${guildId}`);
        } else {
            await this.application?.commands.set(commands);
            logger.info(`Registering commands to global`);
        }
    }

    /**
     * Registers modules. (Commands and Events)
     */
    async registerModules() {
        // Commands
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise('src/commands/**/*{.ts,.js}');
        commandFiles.map(async (filePath) => {
            const command: CommandType = await this.importFile(path.join(__dirname, '..', '..', filePath));
            if (!command.name) return;
            logger.info(`Registering command ${command.name}...`);

            this.commands.set(command.name, command);
            slashCommands.push(command);
        });

        this.on('ready', () => {
            this.registerCommands({ commands: slashCommands, guildId: process.env.GUILD_ID });
        });

        // Events
        const eventFiles = await globPromise('src/events/**/*{.ts,.js}');
        eventFiles.map(async (filePath) => {
            const event = await this.importFile(path.join(__dirname, '..', '..', filePath));
            logger.info(`Registering event ${event.name}...`);

            this.on(event.name, event.run);
        });
    }
}
