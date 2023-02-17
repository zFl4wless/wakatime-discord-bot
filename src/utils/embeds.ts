import { randomHex } from 'color-util-nodejs';
import { ColorResolvable, EmbedBuilder } from 'discord.js';

export const defaultEmbed = () => new EmbedBuilder().setColor(randomHex().toString() as ColorResolvable);

export const loadingEmbed = () =>
    defaultEmbed()
        .setTitle('<a:loading:1075747071644151868> Loading...')
        .setDescription('Please wait while we fetch the data from the WakaTime API.')

export const errorEmbed = (title: string, description: string) =>
    new EmbedBuilder().setTitle(title).setDescription(description).setColor('#E03B24');
