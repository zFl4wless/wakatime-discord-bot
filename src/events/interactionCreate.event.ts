import { CommandInteractionOptionResolver } from 'discord.js';
import { client } from '..';
import { Event } from '../structure/Event';
import { ExtendedInteraction } from '../types/core/Command';

/**
 * This event is emitted when a command is used.
 */
export default new Event('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            return interaction.reply({ content: 'This command does not exist.', ephemeral: true });
        }

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction,
        });
    }
});
