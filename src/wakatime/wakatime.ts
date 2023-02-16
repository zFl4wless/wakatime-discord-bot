import axios, { AxiosResponse } from 'axios';
import { getUserById } from '../db/user/user';
import { keys } from '..';
import { decrypt } from '../utils/crypto';
import { errorEmbed, loadingEmbed } from '../utils/embeds';
import { EmbedBuilder } from 'discord.js';
import { ExtendedInteraction } from '../types/Command';

// The base URL for the WakaTime API
const BASE_URL = 'https://wakatime.com/api/v1';

/**
 * Makes a request to the WakaTime API.
 *
 * @param method The HTTP method to use.
 * @param endpoint The endpoint to use.
 * @param userId The ID of the user to make the request for.
 * @param interaction The interaction to send feedback to.
 * @param data The data to send with the request.
 * @returns The response from the API.
 */
export async function request(
    method: string,
    endpoint: string,
    userId: string,
    interaction: ExtendedInteraction,
    data?: any,
) {
    await interaction.reply({
        embeds: [loadingEmbed()],
        ephemeral: true,
    });

    const accessToken = await getAccessToken(userId);

    let response: AxiosResponse | null;
    try {
        response = await axios(`${BASE_URL}/${endpoint}`, {
            method: method,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (error) {
        console.log(error.response);

        await interaction.editReply({
            embeds: [errorEmbed(error.response.status.toString(), error.response.data.errors.join('\n'))],
        });
        return null;
    }
    return response;
}

/**
 * Gets the access token of a user.
 *
 * @param userId The ID of the user to get the access token from.
 * @returns The access token of the user.
 */
async function getAccessToken(userId: string) {
    const user = await getUserById(userId);
    const [nonce, chipertext] = user.accessToken.split('$');

    return decrypt(chipertext, nonce, keys);
}

/**
 * Creates an embed from the data returned from the WakaTime API.
 *
 * @param title The title of the embed.
 * @param description The description of the embed.
 * @param data The data to put in the embed.
 * @returns The created embed.
 */
export function getEmbedFromData(title: string, description: string, data: any) {
    const embed = new EmbedBuilder();
    embed.setTitle(title);
    embed.setDescription(`*${description}*`);
    embed.setColor('#FFFFFF');
    embed.addFields(
        Object.keys(data).map((key) => {
            const value =
                data[key].toString().length > 1024 ? data[key].toString().slice(0, 1021) + '...' : data[key].toString();

            return {
                name: key,
                value: `\`\`\`${value}\`\`\``,
                inline: true,
            };
        }),
    );

    return embed;
}
