import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import getlorem from 'getlorem';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'lorem',
   description: 'Generate Lorem Ipsum text.',
   options: [{
      name: 'words',
      description: 'Generate Lorem Ipsum text.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'amount',
         description: 'The amount of words to generate.',
         type: ApplicationCommandOptionType.Integer,
         required: true
      }]
   }, {
      name: 'sentences',
      description: 'Generate Lorem Ipsum text.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'amount',
         description: 'The amount of sentences to generate.',
         type: ApplicationCommandOptionType.Integer,
         required: true
      }]
   }, {
      name: 'paragraphs',
      description: 'Generate Lorem Ipsum text.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'amount',
         description: 'The amount of paragraphs to generate.',
         type: ApplicationCommandOptionType.Integer,
         required: true
      }]
   }, {
      name: 'list',
      description: 'Generate Lorem Ipsum text.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'amount',
         description: 'The amount of list items to generate.',
         type: ApplicationCommandOptionType.Integer,
         required: true
      }]
   }, {
      name: 'bytes',
      description: 'Generate Lorem Ipsum text.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'amount',
         description: 'The amount of bytes to generate.',
         type: ApplicationCommandOptionType.Integer,
         required: true
      }]
   }]
}, async (client, interaction) => {

   const subcommand = interaction.options.getSubcommand();
   const amount = interaction.options.getInteger('amount');

   const loremText = getlorem[subcommand](amount);

   try {

      const loremGeneratorEmbed = new EmbedBuilder()
         .setColor(Constants.EMBED_COLOR)
         .setTitle(`Lorem Ipsum Generator (${amount} ${subcommand})`)
         .setDescription(
            codeBlock(loremText)
         );

      await interaction.reply({
         embeds: [loremGeneratorEmbed]
      });

   } catch (_) {
     
      await interaction.reply({
         content: 'The specified amount is too large.',
         ephemeral: true
      });
      
   };

});