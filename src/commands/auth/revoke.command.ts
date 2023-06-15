import { Command } from '../../structure/Command';
import { defaultEmbed } from '../../utils/embeds';

/**
 * This command is used to inform the user about how to revoke the authorization.
 */
export default new Command({
    name: 'revoke',
    description: 'Information about how to revoke the authorization.',
    run: async ({ interaction }) => {
        const embed = defaultEmbed()
            .setTitle('Revoke Authorization')
            .setDescription(
                'To revoke the authorization, you need to go to the [WakaTime website](https://wakatime.com/settings/authorizations) and click on the "Revoke Access" button for the "Discord WakaBotTime" application.',
            );

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
});
