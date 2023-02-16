import { Command } from '../structure/Command';
import { getEmbedFromData, request } from '../wakatime/wakatime';

/**
 * This command gets the total time logged since account created.
 *
 * @see https://wakatime.com/developers#all_time_since_today
 */
export default new Command({
    name: 'all-time-since-today',
    description: 'Gets the total time logged since account is created.',
    run: async ({ interaction }) => {
        const response = await request('GET', 'users/current/all_time_since_today', interaction.user.id, interaction);
        if (!response) return;

        const data = formatResponse(response?.data.data as AllTimeSinceTodayResponse);
        const dataEmbed = getEmbedFromData(
            'All Time Since Today',
            'Gets the total time logged since account is created.',
            data,
        );

        await interaction.editReply({
            embeds: [dataEmbed],
        });
    },
});

type AllTimeSinceTodayResponse = {
    decimal: string;
    digital: string;
    is_up_to_date: boolean;
    percent_calculated: number;
    range: Range;
    text: string;
    timeout: number;
    total_seconds: number;
};
type Range = {
    end: string;
    end_date: string;
    end_text: string;
    start: string;
    start_date: string;
    start_text: string;
    timezone: string;
};
function formatResponse(response: AllTimeSinceTodayResponse) {
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
