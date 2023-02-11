import { SlashCommand } from '../../classes';
import tinycolor, { type Instance as ColorInstance } from 'tinycolor2';
import { createCanvas } from 'canvas';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, codeBlock, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { randomUUID } from 'crypto';
import { minutesToMilliseconds } from 'date-fns';

export default new SlashCommand({
   name: 'desaturate-color',
   description: 'Desaturate a color.',
   options: [{
      name: 'color',
      description: 'The color you want to manipulate.',
      type: ApplicationCommandOptionType.String,
      required: true
   }]
}, async (client, interaction) => {

   await interaction.deferReply();

   const baseColor = tinycolor(
      interaction.options.getString('color')
   );

   if (!baseColor.isValid())
      return interaction.editReply({
         content: 'The color you specified is invalid.'
      });

   const componentIds = {
      'INCREASE': randomUUID(),
      'DECREASE': randomUUID(),
      'SET': randomUUID()
   };

   let currentDesaturationPercentage = 50;

   async function updateMessage(desaturatedColor: ColorInstance): Promise<void> {

      const WIDTH = 300;
      const HEIGHT = 50;
      const SEPARATOR_WIDTH = 10;

      const canvas = createCanvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = baseColor.toHexString();
      ctx.fillRect(0, 0, (WIDTH / 2) - (SEPARATOR_WIDTH / 2), HEIGHT);

      ctx.fillStyle = desaturatedColor.toHexString();
      ctx.fillRect(WIDTH / 2, 0, (WIDTH / 2) - (SEPARATOR_WIDTH / 2), HEIGHT);

      const desaturateColorEmbed = new EmbedBuilder()
         .setColor(0x2f3136)
         .setTitle(`Desaturate Color`)
         .setDescription(
            codeBlock(`Base Color   | ${baseColor.toHexString()}`) +
            '\u200b' +
            codeBlock(`Desaturation | ${currentDesaturationPercentage}%`) +
            codeBlock(`HEX          | ${desaturatedColor.toHexString()}`) +
            codeBlock(`RGB          | ${desaturatedColor.toRgbString()}`) +
            codeBlock(`HSL          | ${desaturatedColor.toHslString()}`) +
            codeBlock(`HSV          | ${desaturatedColor.toHsvString()}`)
         )
         .setFooter({ text: 'Some colors may not be affected by the saturation.' })
         .setImage('attachment://desaturate_color.png');

      const updateDesaturationButtonsRow = new ActionRowBuilder()
         .setComponents(
            new ButtonBuilder()
               .setCustomId(componentIds['DECREASE'])
               .setDisabled(currentDesaturationPercentage - 10 < 0)
               .setLabel('- 10%')
               .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
               .setCustomId(componentIds['SET'])
               .setLabel('Set')
               .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
               .setCustomId(componentIds['INCREASE'])
               .setDisabled(currentDesaturationPercentage + 10 > 100)
               .setLabel('+ 10%')
               .setStyle(ButtonStyle.Primary),
         );

      const desaturatedColorImageAttachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'desaturate_color.png' });

      await interaction.editReply({
         embeds: [desaturateColorEmbed],
         components: [updateDesaturationButtonsRow as any],
         files: [desaturatedColorImageAttachment]
      });

   }

   const desaturatedColor = baseColor.clone().desaturate(currentDesaturationPercentage);

   await updateMessage(desaturatedColor);

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

            currentDesaturationPercentage -= 10;

            const desaturatedColor = baseColor.clone().desaturate(currentDesaturationPercentage);
      
            await updateMessage(desaturatedColor);
      
            await componentInteraction.deferUpdate();

            break;

         }

         case componentIds['INCREASE']: {

            currentDesaturationPercentage += 10;

            const desaturatedColor = baseColor.clone().desaturate(currentDesaturationPercentage);
      
            await updateMessage(desaturatedColor);
      
            await componentInteraction.deferUpdate();

            break;

         }

         case componentIds['SET']: {

            const setDesaturationModal = new ModalBuilder()
               .setCustomId('DESATURATE_COLOR')
               .setTitle('Desaturate Color')
               .setComponents(
                  new ActionRowBuilder<TextInputBuilder>()
                     .setComponents(
                        new TextInputBuilder()
                           .setCustomId('DESATURATION_PERCENTAGE')
                           .setLabel('Desaturation percentage')
                           .setMinLength(1)
                           .setMaxLength(3)
                           .setPlaceholder('0 - 100')
                           .setValue(currentDesaturationPercentage.toString())
                           .setStyle(TextInputStyle.Short)
                     )
               );

            await componentInteraction.showModal(setDesaturationModal);

            const modalSubmitInteraction = await componentInteraction.awaitModalSubmit({
               filter: (modalSubmitInteraction) => modalSubmitInteraction.customId === 'DESATURATE_COLOR',
               time: minutesToMilliseconds(15)
            });

            const desaturationPercentage = parseInt(
               modalSubmitInteraction.fields.getTextInputValue('DESATURATION_PERCENTAGE')
            );

            if (isNaN(desaturationPercentage))
               return void modalSubmitInteraction.reply({
                  content: 'You must provide a number value.',
                  ephemeral: true
               });

            if (desaturationPercentage < 0 || desaturationPercentage > 100)
               return void modalSubmitInteraction.reply({
                  content: 'You must provide a number between 0 and 100.',
                  ephemeral: true
               });

            currentDesaturationPercentage = desaturationPercentage;

            const desaturatedColor = baseColor.clone().desaturate(currentDesaturationPercentage);
      
            await updateMessage(desaturatedColor);
      
            await modalSubmitInteraction.deferUpdate();

            break;

         }

         default:
            break;

      }

   });

   componentCollector.on('end', () => {});

});