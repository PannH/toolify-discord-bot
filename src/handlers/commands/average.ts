import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'average',
   description: 'Calculate an average from a list of values.',
   options: [{
      name: 'values',
      description: 'The values you want to calculate the average from (each separated by a ",").',
      type: ApplicationCommandOptionType.String,
      required: true
   }]
}, async (client, interaction) => {
   
   const valuesString = interaction.options.getString('values');
   const values = valuesString.split(',').map((valueString) => Number(valueString));

   if (values.includes(NaN))
      return interaction.reply({
         content: 'Some of the specified values are not a number.',
         ephemeral: true
      });

   const average = values.reduce((acc, value) => acc + value, 0) / values.length;

   const averageCalculatorEmbed = new EmbedBuilder()
      .setColor(Constants.EMBED_COLOR)
      .setTitle('Average Calculator')
      .setDescription(
         codeBlock(
            values.join(', ')
         ) +
         codeBlock(`= ${average}`)
      );

   await interaction.reply({
      embeds: [averageCalculatorEmbed]
   });

});