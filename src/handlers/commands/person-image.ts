import { SlashCommand } from '../../classes';
import { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import axios from 'axios';
import { minutesToMilliseconds } from 'date-fns';
import { randomUUID } from 'crypto';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'person-image',
   description: 'Generate a picture of a person that DOES NOT exist.'
}, async (client, interaction) => {

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

      const { data: imageBuffer } = await axios.get('https://thispersondoesnotexist.com/image', {
         responseType: 'arraybuffer'
      });

      const personPictureImageAttachment = new AttachmentBuilder(imageBuffer, { name: 'person_picture.png' });
   
      const personPictureEmbed = new EmbedBuilder()
         .setColor(Constants.EMBED_COLOR)
         .setTitle('Unexisting Person Picture Generator')
         .setImage('attachment://person_picture.png');

      await interaction.editReply({
         embeds: [personPictureEmbed],
         components: [regenerateImageAndUpdateMessage as any],
         files: [personPictureImageAttachment]
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