import { SlashCommand } from '../../classes';
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import Constants from '../../utils/Constants';
import { minutesToMilliseconds } from 'date-fns';
import { randomUUID } from 'crypto';

export default new SlashCommand({
   name: 'animal-image',
   description: 'Generate random animal images.',
   options: [{
      name: 'bird',
      description: 'Generate a random image of a bird.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'cat',
      description: 'Generate a random image of a cat.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'dog',
      description: 'Generate a random image of a dog.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'fox',
      description: 'Generate a random image of a fox.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'kangaroo',
      description: 'Generate a random image of a kangaroo.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'koala',
      description: 'Generate a random image of a koala.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'panda',
      description: 'Generate a random image of a panda.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'raccoon',
      description: 'Generate a random image of a raccoon.',
      type: ApplicationCommandOptionType.Subcommand
   }]
}, async (client, interaction) => {

   const subcommand = interaction.options.getSubcommand();

   await interaction.deferReply();

   const componentIds = {
      'REGENERATE': randomUUID()
   };

   const regenerateImageAndUpdateMessage = new ActionRowBuilder()
      .setComponents(
         new ButtonBuilder()
            .setCustomId(componentIds['REGENERATE'])
            .setLabel('Regenerate')
            .setStyle(ButtonStyle.Primary)
      );

   async function regenerateAndUpdateMessage(): Promise<void> {

      const { data } = await axios.get(`https://some-random-api.ml/animal/${subcommand}`);
   
      const randomAnimalImageEmbed = new EmbedBuilder()
         .setColor(Constants.EMBED_COLOR)
         .setTitle(`Random Animal Image Generator (${subcommand})`)
         .setImage(data.image);

      await interaction.editReply({
         embeds: [randomAnimalImageEmbed],
         components: [regenerateImageAndUpdateMessage as any]
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