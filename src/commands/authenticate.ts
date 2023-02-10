import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { Command } from '../structure/Command';
import { ButtonStyle } from 'discord.js';
import sodium from 'libsodium-wrappers';
import { userStates } from '../api';

/**
 * This command is used to authenticate the user through the official WakaTime website.
 */
export default new Command({
    name: 'authenticate',
    description: 'Authenticating this app through the official WakaTime website.',
    run: async ({ interaction }) => {
        const state = sodium.randombytes_buf(32, 'hex');
        userStates.set(state, interaction.user.id);

        const authorizeQueryParams = {
            client_id: process.env.CLIENT_ID,
            redirect_uri: `${process.env.API_URL}/redirect`,
            response_type: 'code',
            scope: 'read_logged_time,read_stats',
            state: state,
        };

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Login')
                .setURL(`https://wakatime.com/oauth/authorize?${new URLSearchParams(authorizeQueryParams)}`),
        );

        await interaction.reply({
            content: 'You can authenticate here.',
            components: [buttons as any],
            ephemeral: true,
        });
    },
});
