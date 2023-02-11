import { SlashCommand } from '../../classes';
import tinycolor, { type Instance as ColorInstance } from 'tinycolor2';
import { createCanvas } from 'canvas';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, codeBlock, type StringSelectMenuInteraction } from 'discord.js';
import { randomUUID } from 'crypto';
import { randomInteger } from '../../functions';

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
         .setImage('attachment://color.png');

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

      const colorImageAttachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'color.png' });

      await interaction.editReply({
         embeds: [colorGeneratorEmbed],
         components: [changeStyleSelectMenuRow, regenerateColorButtonRow as any],
         files: [colorImageAttachment]
      });

   }

   const randomColor = tinycolor.random();

   await updateMessage(randomColor);

   const componentCollector = interaction.channel.createMessageComponentCollector({
      filter: (interaction) => Object.values(componentIds).includes(interaction.customId)
   });

   componentCollector.on('collect', async (componentInteraction) => {

      switch (componentInteraction.customId) {

         case componentIds['REGENERATE']: {

            let randomColor: ColorInstance;

            switch (currentColorStyle) {

               case 'any': {

                  randomColor = tinycolor.random();

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