import { Command } from '../structure/Command';
import { request } from '../wakatime/wakatime';

/**
 * This command gets the total time logged since account created.
 *
 * @see https://wakatime.com/developers#all_time_since_today
 */
export default new Command({
    name: 'all-time-since-today',
    description: 'Gets the total time logged since account created.',
    run: async ({ interaction }) => {
        const response = await request('GET', 'users/current/all_time_since_today', interaction.user.id, interaction);
        if (!response) return;

        await interaction.reply({
            content: `You have logged ${response.data.data.text} since account creation.`,
            ephemeral: true,
        });
    },
});
