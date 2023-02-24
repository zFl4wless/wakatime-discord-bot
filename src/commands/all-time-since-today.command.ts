import { Command } from '../structure/Command';
import { AllTimeSinceTodayResponse } from '../types/wakatime/all-time-since-today.types';
import request from '../wakatime';

/**
 * This command gets the total time logged since account created.
 *
 * @see https://wakatime.com/developers#all_time_since_today
 */
export default new Command({
    name: 'all-time-since-today',
    description: 'Gets the total time logged since account is created.',
    run: async ({ interaction }) => {
        await request<AllTimeSinceTodayResponse>({
            title: 'All time since today',
            description: 'Gets the total time logged since account is created.',
            endpoint: 'users/current/all_time_since_today',
            userId: interaction.user.id,
            interaction: interaction,
            formatResponse: formatResponse,
        });
    },
});

export function formatResponse(response: AllTimeSinceTodayResponse) {
    return {
        decimal: response.decimal,
        digital: response.digital,
        'is up to date': response.is_up_to_date,
        'percent calculated': response.percent_calculated,
        start: response.range.start_text,
        end: response.range.end_text,
        timezone: response.range.timezone,
        text: response.text,
        timeout: response.timeout,
        'total seconds': response.total_seconds,
    };
}
