import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders';
import { Command } from '../structure/Command';
import { ButtonStyle } from 'discord.js';

const authorizeOptions = {
    client_id: process.env.CLIENT_ID,
    redirect_uri: `${process.env.API_URL}/redirect`,
    response_type: 'code',
    scope: 'read_logged_time,read_stats',
};
const authorizeUrl = `https://wakatime.com/oauth/authorize?${new URLSearchParams(authorizeOptions)}`;

/**
 * This command is used to authenticate the user through the official WakaTime website.
 */
export default new Command({
    name: 'authenticate',
    description: 'Authenticating this app through the official WakaTime website.',
    run: async ({ interaction }) => {
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Login').setURL(authorizeUrl),
        );

        await interaction.reply({
            content: 'You can authenticate here.',
            components: [buttons as any],
            ephemeral: true,
        });
    },
});