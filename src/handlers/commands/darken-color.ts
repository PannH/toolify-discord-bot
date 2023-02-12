import { SlashCommand } from '../../classes';
import tinycolor, { type Instance as ColorInstance } from 'tinycolor2';
import { createCanvas } from 'canvas';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, codeBlock, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { randomUUID } from 'crypto';
import { minutesToMilliseconds } from 'date-fns';

export default new SlashCommand({
   name: 'darken-color',
   description: 'Darken a color.',
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

   let currentDarkeningPercentage = 50;

   async function updateMessage(darkenedColor: ColorInstance): Promise<void> {

      const WIDTH = 300;
      const HEIGHT = 50;

      const canvas = createCanvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = baseColor.toHexString();
      ctx.fillRect(0, 0, WIDTH / 2, HEIGHT);

      ctx.fillStyle = darkenedColor.toHexString();
      ctx.fillRect(WIDTH / 2, 0, WIDTH / 2, HEIGHT);

      const darkenColorEmbed = new EmbedBuilder()
         .setColor(0x2f3136)
         .setTitle(`Darken Color`)
         .setDescription(
            codeBlock(`Base Color | ${baseColor.toHexString()}`) +
            '\u200b' +
            codeBlock(`Darkening  | ${currentDarkeningPercentage}%`) +
            codeBlock(`HEX        | ${darkenedColor.toHexString()}`) +
            codeBlock(`RGB        | ${darkenedColor.toRgbString()}`) +
            codeBlock(`HSL        | ${darkenedColor.toHslString()}`) +
            codeBlock(`HSV        | ${darkenedColor.toHsvString()}`)
         )
         .setImage('attachment://darken_color.png');

      const updateDarkeningButtonsRow = new ActionRowBuilder()
         .setComponents(
            new ButtonBuilder()
               .setCustomId(componentIds['DECREASE'])
               .setDisabled(currentDarkeningPercentage - 10 < 0)
               .setLabel('- 10%')
               .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
               .setCustomId(componentIds['SET'])
               .setLabel('Set')
               .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
               .setCustomId(componentIds['INCREASE'])
               .setDisabled(currentDarkeningPercentage + 10 > 100)
               .setLabel('+ 10%')
               .setStyle(ButtonStyle.Primary),
         );

      const darkenedColorImageAttachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'darken_color.png' });

      await interaction.editReply({
         embeds: [darkenColorEmbed],
         components: [updateDarkeningButtonsRow as any],
         files: [darkenedColorImageAttachment]
      });

   }

   const darkenedColor = baseColor.clone().darken(currentDarkeningPercentage);

   await updateMessage(darkenedColor);

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

            currentDarkeningPercentage -= 10;

            const darkenedColor = baseColor.clone().darken(currentDarkeningPercentage);
      
            await updateMessage(darkenedColor);
      
            await componentInteraction.deferUpdate();

            break;

         }

         case componentIds['INCREASE']: {

            currentDarkeningPercentage += 10;

            const darkenedColor = baseColor.clone().darken(currentDarkeningPercentage);
      
            await updateMessage(darkenedColor);
      
            await componentInteraction.deferUpdate();

            break;

         }

         case componentIds['SET']: {

            const setDarkeningModal = new ModalBuilder()
               .setCustomId('DARKEN_COLOR')
               .setTitle('Darken Color')
               .setComponents(
                  new ActionRowBuilder<TextInputBuilder>()
                     .setComponents(
                        new TextInputBuilder()
                           .setCustomId('DARKENING_PERCENTAGE')
                           .setLabel('Darkening percentage')
                           .setMinLength(1)
                           .setMaxLength(3)
                           .setPlaceholder('0 - 100')
                           .setValue(currentDarkeningPercentage.toString())
                           .setStyle(TextInputStyle.Short)
                     )
               );

            await componentInteraction.showModal(setDarkeningModal);

            const modalSubmitInteraction = await componentInteraction.awaitModalSubmit({
               filter: (modalSubmitInteraction) => modalSubmitInteraction.customId === 'DARKEN_COLOR',
               time: minutesToMilliseconds(15)
            });

            const darkeningPercentage = parseInt(
               modalSubmitInteraction.fields.getTextInputValue('DARKENING_PERCENTAGE')
            );

            if (isNaN(darkeningPercentage))
               return void modalSubmitInteraction.reply({
                  content: 'You must provide a number value.',
                  ephemeral: true
               });

            if (darkeningPercentage < 0 || darkeningPercentage > 100)
               return void modalSubmitInteraction.reply({
                  content: 'You must provide a number between 0 and 100.',
                  ephemeral: true
               });

            currentDarkeningPercentage = darkeningPercentage;

            const darkenedColor = baseColor.clone().darken(currentDarkeningPercentage);
      
            await updateMessage(darkenedColor);
      
            await modalSubmitInteraction.deferUpdate();

            break;

         }

         default:
            break;

      }

   });

   componentCollector.on('end', () => {});

});