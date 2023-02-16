import { EmbedBuilder } from 'discord.js';

export const loadingEmbed = () =>
    new EmbedBuilder()
        .setTitle('<a:loading:1075747071644151868> Loading...')
        .setDescription('Please wait while we fetch the data from the WakaTime API.')
        .setColor('#FFFFFF');

export const errorEmbed = (title: string, description: string) =>
    new EmbedBuilder().setTitle(title).setDescription(description).setColor('#E03B24');
