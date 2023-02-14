import { EmbedBuilder } from 'discord.js';

export const errorEmbed = (title: string, description: string) =>
    new EmbedBuilder().setTitle(title).setDescription(description).setColor('#E03B24');
