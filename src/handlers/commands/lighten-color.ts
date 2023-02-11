import { SlashCommand } from '../../classes';
import tinycolor, { type Instance as ColorInstance } from 'tinycolor2';
import { createCanvas } from 'canvas';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, codeBlock, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { randomUUID } from 'crypto';
import { minutesToMilliseconds } from 'date-fns';

export default new SlashCommand({
   name: 'lighten-color',
   description: 'Lighten a color.',
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

   let currentLighteningPercentage = 50;

   async function updateMessage(lightenedColor: ColorInstance): Promise<void> {

      const WIDTH = 300;
      const HEIGHT = 50;
      const SEPARATOR_WIDTH = 10;

      const canvas = createCanvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = baseColor.toHexString();
      ctx.fillRect(0, 0, (WIDTH / 2) - (SEPARATOR_WIDTH / 2), HEIGHT);

      ctx.fillStyle = lightenedColor.toHexString();
      ctx.fillRect(WIDTH / 2, 0, (WIDTH / 2) - (SEPARATOR_WIDTH / 2), HEIGHT);

      const lightenColorEmbed = new EmbedBuilder()
         .setColor(0x2f3136)
         .setTitle(`Lighten Color`)
         .setDescription(
            codeBlock(`Base Color | ${baseColor.toHexString()}`) +
            '\u200b' +
            codeBlock(`Lightening | ${currentLighteningPercentage}%`) +
            codeBlock(`HEX        | ${lightenedColor.toHexString()}`) +
            codeBlock(`RGB        | ${lightenedColor.toRgbString()}`) +
            codeBlock(`HSL        | ${lightenedColor.toHslString()}`) +
            codeBlock(`HSV        | ${lightenedColor.toHsvString()}`)
         )
         .setImage('attachment://lighten_color.png');

      const updateLighteningButtonsRow = new ActionRowBuilder()
         .setComponents(
            new ButtonBuilder()
               .setCustomId(componentIds['DECREASE'])
               .setDisabled(currentLighteningPercentage - 10 < 0)
               .setLabel('- 10%')
               .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
               .setCustomId(componentIds['SET'])
               .setLabel('Set')
               .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
               .setCustomId(componentIds['INCREASE'])
               .setDisabled(currentLighteningPercentage + 10 > 100)
               .setLabel('+ 10%')
               .setStyle(ButtonStyle.Primary),
         );

      const lightenedColorImageAttachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'lighten_color.png' });

      await interaction.editReply({
         embeds: [lightenColorEmbed],
         components: [updateLighteningButtonsRow as any],
         files: [lightenedColorImageAttachment]
      });

   }

   const lightenedColor = baseColor.clone().lighten(currentLighteningPercentage);

   await updateMessage(lightenedColor);

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

            currentLighteningPercentage -= 10;

            const lightenedColor = baseColor.clone().lighten(currentLighteningPercentage);
      
            await updateMessage(lightenedColor);
      
            await componentInteraction.deferUpdate();

            break;

         }

         case componentIds['INCREASE']: {

            currentLighteningPercentage += 10;

            const lightenedColor = baseColor.clone().lighten(currentLighteningPercentage);
      
            await updateMessage(lightenedColor);
      
            await componentInteraction.deferUpdate();

            break;

         }

         case componentIds['SET']: {

            const setLighteningModal = new ModalBuilder()
               .setCustomId('LIGHTEN_COLOR')
               .setTitle('Lighten Color')
               .setComponents(
                  new ActionRowBuilder<TextInputBuilder>()
                     .setComponents(
                        new TextInputBuilder()
                           .setCustomId('LIGHTENING_PERCENTAGE')
                           .setLabel('Lightening percentage')
                           .setMinLength(1)
                           .setMaxLength(3)
                           .setPlaceholder('0 - 100')
                           .setValue(currentLighteningPercentage.toString())
                           .setStyle(TextInputStyle.Short)
                     )
               );

            await componentInteraction.showModal(setLighteningModal);

            const modalSubmitInteraction = await componentInteraction.awaitModalSubmit({
               filter: (modalSubmitInteraction) => modalSubmitInteraction.customId === 'LIGHTEN_COLOR',
               time: minutesToMilliseconds(15)
            });

            const lighteningPercentage = parseInt(
               modalSubmitInteraction.fields.getTextInputValue('LIGHTENING_PERCENTAGE')
            );

            if (isNaN(lighteningPercentage))
               return void modalSubmitInteraction.reply({
                  content: 'You must provide a number value.',
                  ephemeral: true
               });

            if (lighteningPercentage < 0 || lighteningPercentage > 100)
               return void modalSubmitInteraction.reply({
                  content: 'You must provide a number between 0 and 100.',
                  ephemeral: true
               });

            currentLighteningPercentage = lighteningPercentage;

            const lightenedColor = baseColor.clone().lighten(currentLighteningPercentage);
      
            await updateMessage(lightenedColor);
      
            await modalSubmitInteraction.deferUpdate();

            break;

         }

         default:
            break;

      }

   });

   componentCollector.on('end', () => {});

});