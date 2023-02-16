import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { evaluate } from 'mathjs';

export default new SlashCommand({
   name: 'calculate',
   description: 'Calculate a given mathematical expression.',
   options: [{
      name: 'expression',
      description: 'The expression to calculate',
      type: ApplicationCommandOptionType.String,
      required: true
   }]
}, async (client, interaction) => {

   const expression = interaction.options.getString('expression');

   let result: any;
   try {
      result = evaluate(expression);
   } catch (error: any) {
      result = error.message;
   }

   const calculatorEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle('Calculator')
      .setDescription(
         codeBlock(expression) +
         codeBlock(`= ${result}`)
      );

   await interaction.reply({
      embeds: [calculatorEmbed]
   });

});