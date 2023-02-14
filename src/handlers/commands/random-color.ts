import { SlashCommand } from '../../classes';
import tinycolor, { type Instance as ColorInstance } from 'tinycolor2';
import { createCanvas } from 'canvas';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, codeBlock, type StringSelectMenuInteraction } from 'discord.js';
import { randomUUID } from 'crypto';
import { randomArrayElement, randomInteger } from '../../functions';
import { minutesToMilliseconds } from 'date-fns';

export default new SlashCommand({
   name: 'random-color',
   description: 'Generate random colors with different styles.'
}, async (client, interaction) => {

   await interaction.deferReply();

   const componentIds = {
      'REGENERATE': randomUUID(),
      'CHANGE_STYLE': randomUUID()
   };

   let currentColorStyle = 'any';

   async function updateMessage(color: ColorInstance): Promise<void> {

      const WIDTH = 300;
      const HEIGHT = 50;

      const canvas = createCanvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = color.toHexString();
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const colorGeneratorEmbed = new EmbedBuilder()
         .setColor(0x2f3136)
         .setTitle('Random Color Generator')
         .setDescription(
            codeBlock(`HEX | ${color.toHexString()}`) +
            codeBlock(`RGB | ${color.toRgbString()}`) +
            codeBlock(`HSL | ${color.toHslString()}`) +
            codeBlock(`HSV | ${color.toHsvString()}`)
         )
         .setFooter({ text: 'Use the select menu to change the color style.' })
         .setImage('attachment://random_color.png');

      const changeStyleSelectMenuRow = new ActionRowBuilder()
            .setComponents(
               new StringSelectMenuBuilder()
                  .setCustomId(componentIds['CHANGE_STYLE'])
                  .setOptions(
                     new StringSelectMenuOptionBuilder()
                        .setDefault(currentColorStyle === 'any')
                        .setLabel('Any')
                        .setValue('any'),
                     new StringSelectMenuOptionBuilder()
                        .setDefault(currentColorStyle === 'material')
                        .setLabel('Material')
                        .setValue('material'),
                     new StringSelectMenuOptionBuilder()
                        .setDefault(currentColorStyle === 'pastel')
                        .setLabel('Pastel')
                        .setValue('pastel'),
                     new StringSelectMenuOptionBuilder()
                        .setDefault(currentColorStyle === 'bright')
                        .setLabel('Bright')
                        .setValue('bright'),
                     new StringSelectMenuOptionBuilder()
                        .setDefault(currentColorStyle === 'dull')
                        .setLabel('Dull')
                        .setValue('dull'),
                     new StringSelectMenuOptionBuilder()
                        .setDefault(currentColorStyle === 'gray')
                        .setLabel('Gray')
                        .setValue('gray'),
                  )
            );

      const regenerateColorButtonRow = new ActionRowBuilder()
            .setComponents(
               new ButtonBuilder()
                  .setCustomId(componentIds['REGENERATE'])
                  .setLabel('Regenerate')
                  .setStyle(ButtonStyle.Primary)
            );

      const colorImageAttachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'random_color.png' });

      await interaction.editReply({
         embeds: [colorGeneratorEmbed],
         components: [changeStyleSelectMenuRow, regenerateColorButtonRow as any],
         files: [colorImageAttachment]
      });

   }

   const randomColor = tinycolor.random();

   await updateMessage(randomColor);

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

         case componentIds['REGENERATE']: {

            let randomColor: ColorInstance;

            switch (currentColorStyle) {

               case 'any': {

                  randomColor = tinycolor.random();
                  break;

               }

               case 'material': {

                  const baseMaterialColors = [
                     '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
                     '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
                     '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
                     '#ff5722', '#795548', '#9e9e9e', '#607d8b'
                  ];

                  const randomMaterialColor = randomArrayElement(baseMaterialColors);

                  randomColor = tinycolor(randomMaterialColor).lighten(randomInteger(5, 15));
                  break;

               }

               case 'pastel': {

                  randomColor = tinycolor.mix(
                     tinycolor.random().saturate(10),
                     'white'
                  );
                  
                  break;

               }

               case 'bright': {

                  randomColor = tinycolor({
                     h: randomInteger(0, 255),
                     s: 100,
                     l: 50
                  });

                  break;

               }

               case 'dull': {

                  randomColor = tinycolor.mix(
                     tinycolor.random(),
                     'black'
                  ).desaturate(10);

                  break;

               }

               case 'gray': {

                  const randomInt = randomInteger(0, 250);
                  randomColor = tinycolor({
                     r: randomInt,
                     g: randomInt,
                     b: randomInt
                  });

                  break;

               }

               default:
                  break;

            }

            await updateMessage(randomColor);

            await componentInteraction.deferUpdate();

            break;

         }

         case componentIds['CHANGE_STYLE']: {

            const selectMenuInteraction = componentInteraction as StringSelectMenuInteraction;

            currentColorStyle = selectMenuInteraction.values[0];

            await selectMenuInteraction.deferUpdate();

            break;

         }

         default:
            break;

      }

   });

   componentCollector.on('end', () => {});

});