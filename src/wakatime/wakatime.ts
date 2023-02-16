import axios, { AxiosResponse } from 'axios';
import { getUserById } from '../db/user/user';
import { keys } from '..';
import { decrypt } from '../utils/crypto';
import { errorEmbed } from '../utils/embeds';

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
export async function request(method: string, endpoint: string, userId: string, interaction: any, data?: any) {
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
        await interaction.reply({
            embeds: [errorEmbed(error.response.status.toString(), error.response.data.errors.join('\n'))],
            ephemeral: true,
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
