import { SlashCommand } from '../../classes';
import { EmbedBuilder } from 'discord.js';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'help',
   description: 'Display the commands.'
}, async (client, interaction) => {

   const commandsEmbed = new EmbedBuilder()
      .setColor(Constants.EMBED_COLOR)
      .setTitle('Commands')
      .setDescription(
         client.application.commands.cache
            .map((applicationCommand) => `\`/${applicationCommand.name}\`: ${applicationCommand.description}`)
            .join('\n')
      );

   await interaction.reply({
      embeds: [commandsEmbed]
   });

});