import axios from 'axios';
import { getUserById } from '../db/user/user';
import { keys } from '..';
import { decrypt } from '../utils/crypto';
import { defaultEmbed, errorEmbed, loadingEmbed } from '../utils/embeds';
import { ExtendedInteraction } from '../types/Command';
import { HttpResponseCode } from './HttpResponseCode';

const BASE_URL = 'https://wakatime.com/api/v1';

/**
 * Gets data from the WakaTime API and sends it to the user.
 *
 * @param title The title of the embed.
 * @param description The description of the embed.
 * @param endpoint The endpoint to call.
 * @param userId The ID of the user that called the command.
 * @param interaction The interaction to reply to.
 * @param formatResponse The function to format the response.
 */
type Request = {
    title: string;
    description: string;
    endpoint: string;
    params?: Record<string, any>;
    userId: string;
    interaction: ExtendedInteraction;
    formatResponse: (response: any) => any;
};
export default async function request<T>(requestOptions: Request): Promise<void> {
    const { title, description, endpoint, params, userId, interaction, formatResponse } = requestOptions;
    await interaction.reply({
        embeds: [loadingEmbed()],
        ephemeral: true,
    });

    try {
        const accessToken = await getAccessToken(userId);
        const response = await axios(`${BASE_URL}/${endpoint}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: params,
        });

        await interaction.editReply({
            embeds: [getEmbedFromData(title, description, formatResponse(response?.data.data as T))],
        });
    } catch (error) {
        if (error.response && error.response.status in HttpResponseCode) {
            const { code, status, message } = HttpResponseCode[error.response.status];
            await interaction.editReply({
                embeds: [errorEmbed(`${code} ${status}`, message)],
            });
            return;
        }

        await interaction.editReply({
            embeds: [errorEmbed('Unkown Error', 'Please contact the developer. (See `/help`)')],
        });
    }
}

/**
 * Gets the access token of a user.
 *
 * @param userId The ID of the user to get the access token from.
 * @returns The access token of the user.
 */
async function getAccessToken(userId: string): Promise<string | null> {
    const user = await getUserById(userId);
    if (!user) return null;

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
const getEmbedFromData = (title: string, description: string, data: any) =>
    defaultEmbed()
        .setTitle(title)
        .setDescription(`*${description}*`)
        .addFields(
            Object.keys(data).map((key) => {
                const value = data[key];

                return {
                    name: key,
                    value: `\`\`\`${value}\`\`\``,
                    inline: true,
                };
            }),
        );
