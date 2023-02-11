import { SlashCommand } from '../../classes';
import tinycolor, { type Instance as ColorInstance } from 'tinycolor2';
import { createCanvas } from 'canvas';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, codeBlock, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { randomUUID } from 'crypto';
import { minutesToMilliseconds } from 'date-fns';

export default new SlashCommand({
   name: 'saturate-color',
   description: 'Saturate a color.',
   options: [{
      name: 'color',
      description: 'The color you want to manipulate.',
      type: ApplicationCommandOptionType.String,
      required: true
   }]
}, async (client, interaction) => {

   const baseColor = tinycolor(
      interaction.options.getString('color')
   );

   if (!baseColor.isValid())
      return interaction.reply({
         content: 'The color you specified is invalid.',
         ephemeral: true
      });

   await interaction.deferReply();

   const componentIds = {
      'INCREASE': randomUUID(),
      'DECREASE': randomUUID(),
      'SET': randomUUID()
   };

   let currentSaturationPercentage = 50;

   async function updateMessage(saturatedColor: ColorInstance): Promise<void> {

      const WIDTH = 300;
      const HEIGHT = 50;
      const SEPARATOR_WIDTH = 10;

      const canvas = createCanvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = baseColor.toHexString();
      ctx.fillRect(0, 0, (WIDTH / 2) - (SEPARATOR_WIDTH / 2), HEIGHT);

      ctx.fillStyle = saturatedColor.toHexString();
      ctx.fillRect(WIDTH / 2, 0, (WIDTH / 2) - (SEPARATOR_WIDTH / 2), HEIGHT);

      const saturateColorEmbed = new EmbedBuilder()
         .setColor(0x2f3136)
         .setTitle(`Saturate Color`)
         .setDescription(
            codeBlock(`Base Color | ${baseColor.toHexString()}`) +
            '\u200b' +
            codeBlock(`Saturation | ${currentSaturationPercentage}%`) +
            codeBlock(`HEX        | ${saturatedColor.toHexString()}`) +
            codeBlock(`RGB        | ${saturatedColor.toRgbString()}`) +
            codeBlock(`HSL        | ${saturatedColor.toHslString()}`) +
            codeBlock(`HSV        | ${saturatedColor.toHsvString()}`)
         )
         .setImage('attachment://saturate_color.png');

      const updateSaturationButtonsRow = new ActionRowBuilder()
         .setComponents(
            new ButtonBuilder()
               .setCustomId(componentIds['DECREASE'])
               .setDisabled(currentSaturationPercentage - 10 < 0)
               .setLabel('- 10%')
               .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
               .setCustomId(componentIds['SET'])
               .setLabel('Set')
               .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
               .setCustomId(componentIds['INCREASE'])
               .setDisabled(currentSaturationPercentage + 10 > 100)
               .setLabel('+ 10%')
               .setStyle(ButtonStyle.Primary),
         );

      const saturatedColorImageAttachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'saturate_color.png' });

      await interaction.editReply({
         embeds: [saturateColorEmbed],
         components: [updateSaturationButtonsRow as any],
         files: [saturatedColorImageAttachment]
      });

   }

   const saturatedColor = baseColor.clone().saturate(currentSaturationPercentage);

   await updateMessage(saturatedColor);

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

      switch (componentInteraction.customId) {

         case componentIds['DECREASE']: {

            currentSaturationPercentage -= 10;

            const saturatedColor = baseColor.clone().saturate(currentSaturationPercentage);
      
            await updateMessage(saturatedColor);
      
            await componentInteraction.deferUpdate();

            break;

         }

         case componentIds['INCREASE']: {

            currentSaturationPercentage += 10;

            const saturatedColor = baseColor.clone().saturate(currentSaturationPercentage);
      
            await updateMessage(saturatedColor);
      
            await componentInteraction.deferUpdate();

            break;

         }

         case componentIds['SET']: {

            const setSaturationModal = new ModalBuilder()
               .setCustomId('SATURATE_COLOR')
               .setTitle('Saturate Color')
               .setComponents(
                  new ActionRowBuilder<TextInputBuilder>()
                     .setComponents(
                        new TextInputBuilder()
                           .setCustomId('SATURATION_PERCENTAGE')
                           .setLabel('Saturation percentage')
                           .setMinLength(1)
                           .setMaxLength(3)
                           .setPlaceholder('0 - 100')
                           .setValue(currentSaturationPercentage.toString())
                           .setStyle(TextInputStyle.Short)
                     )
               );

            await componentInteraction.showModal(setSaturationModal);

            const modalSubmitInteraction = await componentInteraction.awaitModalSubmit({
               filter: (modalSubmitInteraction) => modalSubmitInteraction.customId === 'SATURATE_COLOR',
               time: minutesToMilliseconds(15)
            });

            const saturationPercentage = parseInt(
               modalSubmitInteraction.fields.getTextInputValue('SATURATION_PERCENTAGE')
            );

            if (isNaN(saturationPercentage))
               return void modalSubmitInteraction.reply({
                  content: 'You must provide a number value.',
                  ephemeral: true
               });

            if (saturationPercentage < 0 || saturationPercentage > 100)
               return void modalSubmitInteraction.reply({
                  content: 'You must provide a number between 0 and 100.',
                  ephemeral: true
               });

            currentSaturationPercentage = saturationPercentage;

            const saturatedColor = baseColor.clone().saturate(currentSaturationPercentage);
      
            await updateMessage(saturatedColor);
      
            await modalSubmitInteraction.deferUpdate();

            break;

         }

         default:
            break;

      }

   });

   componentCollector.on('end', () => {});

});