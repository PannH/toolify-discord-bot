import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { randomInteger } from '../../functions';
import { randomUUID } from 'crypto';
import { minutesToMilliseconds } from 'date-fns';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'random-number',
   description: 'Generate a random number between two given values.',
   options: [{
      name: 'minimum',
      description: 'The minimum value (included).',
      type: ApplicationCommandOptionType.Integer,
      required: true
   }, {
      name: 'maximum',
      description: 'The maximum value (included).',
      type: ApplicationCommandOptionType.Integer,
      required: true
   }]
}, async (client, interaction) => {

   await interaction.deferReply();

   const minInteger = interaction.options.getInteger('minimum');
   const maxInteger = interaction.options.getInteger('maximum');

   const componentIds = {
      'REGENERATE': randomUUID()
   };

   const regenerateNumberButtonRow = new ActionRowBuilder()
      .setComponents(
         new ButtonBuilder()
            .setCustomId(componentIds['REGENERATE'])
            .setLabel('Regenerate')
            .setStyle(ButtonStyle.Primary)
      );

   async function regenerateAndUpdateMessage(): Promise<void> {

      const randomNumber = randomInteger(minInteger, maxInteger);

      const randomNumberEmbed = new EmbedBuilder()
         .setColor(Constants.EMBED_COLOR)
         .setTitle('Random Number Generator')
         .setDescription(
            codeBlock(`Minimum       | ${minInteger}`) +
            codeBlock(`Maximum       | ${maxInteger}`) +
            '\u200b' +
            codeBlock(`Random Number | ${randomNumber}`)
         );

      await interaction.editReply({
         embeds: [randomNumberEmbed],
         components: [regenerateNumberButtonRow as any]
      });

   }

   await regenerateAndUpdateMessage();

   const componentCollector = interaction.channel.createMessageComponentCollector({
      filter: (interaction) => Object.values(componentIds).includes(interaction.customId),
      time: minutesToMilliseconds(15)
   });

   componentCollector.on('collect', async (componentInteraction) => {

      if (componentInteraction.user.id !== interaction.user.id)
         return void componentInteraction.reply({
            content: 'You must type the command yourself to use that.',
            ephemeral: true
         });
      
      if (componentInteraction.customId === componentIds['REGENERATE']) {
         
         await regenerateAndUpdateMessage();

         await componentInteraction.deferUpdate();

      }

   });

   componentCollector.on('end', () => {});

});