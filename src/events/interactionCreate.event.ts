import { CommandInteractionOptionResolver } from 'discord.js';
import { client } from '..';
import { Event } from '../structure/Event';
import { ExtendedInteraction } from '../types/core/Command';

/**
 * This event is emitted when a command is used.
 */
export default new Event('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.followUp('This command does not exist.');

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction,
        });
    }
});
