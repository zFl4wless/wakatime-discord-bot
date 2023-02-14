import axios, { AxiosResponse } from 'axios';
import { getUserById } from '../db/user/user';
import { keys } from '..';
import { decrypt } from '../utils/crypto';
import { errorEmbed } from '../utils/embeds';

export default class WakaTime {
    readonly BASE_URL = 'https://wakatime.com/api/v1';

    async request(method: string, endpoint: string, userId: string, interaction: any, data?: any) {
        const accessToken = await this.getAccessToken(userId);

        let response: AxiosResponse | null;
        try {
            response = await axios(`${this.BASE_URL}/${endpoint}`, {
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

    private async getAccessToken(userId: string) {
        const user = await getUserById(userId);
        const [nonce, chipertext] = user.accessToken.split('$');

        return decrypt(chipertext, nonce, keys);
    }
}
