import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import colormind from 'color-mind';
import tinycolor, { type Instance as ColorInstance} from 'tinycolor2';
import { createCanvas } from 'canvas';
import { randomUUID } from 'crypto';
import { minutesToMilliseconds } from 'date-fns';

export default new SlashCommand({
   name: 'color-palette',
   description: 'Generate color palettes.',
   options: [{
      name: 'random',
      description: 'Generate a random color palette.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'create',
      description: 'Create a color palette according to given colors.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'color1',
         description: 'A color you want in your palette.',
         type: ApplicationCommandOptionType.String
      }, {
         name: 'color2',
         description: 'A color you want in your palette.',
         type: ApplicationCommandOptionType.String
      }, {
         name: 'color3',
         description: 'A color you want in your palette.',
         type: ApplicationCommandOptionType.String
      }, {
         name: 'color4',
         description: 'A color you want in your palette.',
         type: ApplicationCommandOptionType.String
      }, {
         name: 'color5',
         description: 'A color you want in your palette.',
         type: ApplicationCommandOptionType.String
      }]
   }]
}, async (client, interaction) => {

   const subcommand = interaction.options.getSubcommand();

   async function createPaletteImageAttachment(colors: ColorInstance[]): Promise<AttachmentBuilder> {

      const WIDTH = 500;
      const HEIGHT = 50;
      const COLOR_SECTION_WIDTH = WIDTH / colors.length;
   
      const canvas = createCanvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext('2d');
   
      colors.forEach((color, index) => {
   
         ctx.fillStyle = color.toHexString();
         ctx.fillRect(index * COLOR_SECTION_WIDTH, 0, COLOR_SECTION_WIDTH, HEIGHT);
   
      });

      return new AttachmentBuilder(canvas.toBuffer(), { name: 'color_palette.png' });

   }

   await interaction.deferReply();

   switch (subcommand) {

      case 'random': {

         const componentIds = {
            'REGENERATE': randomUUID()
         };

         const regeneratePaletteButtonRow = new ActionRowBuilder()
            .setComponents(
               new ButtonBuilder()
                  .setCustomId(componentIds['REGENERATE'])
                  .setLabel('Regenerate')
                  .setStyle(ButtonStyle.Primary)
            );

         async function regenerateAndUpdateMessage(): Promise<void> {

            const colors = (await colormind()).map((hexColor) => tinycolor(hexColor));

            const paletteImageAttachment = await createPaletteImageAttachment(colors);
   
            const paletteGeneratorEmbed = new EmbedBuilder()
               .setColor(0x2f3136)
               .setTitle('Color Palette Generator')
               .setDescription(
                  codeBlock(
                     colors
                        .map((color) => color.toHexString())
                        .join(' | ')
                  )
               )
               .setImage('attachment://color_palette.png');
   
            await interaction.editReply({
               embeds: [paletteGeneratorEmbed],
               components: [regeneratePaletteButtonRow as any],
               files: [paletteImageAttachment]
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

         break;

      }

      case 'create': {

         const givenColors = interaction.options.data[0].options.map((option) => tinycolor(option.value as string));

         if (givenColors.find((color) => !color.isValid()))
            return interaction.editReply({
               content: 'Some of the specified colors are not valid.'
            });

         const componentIds = {
            'REGENERATE': randomUUID()
         };

         const regeneratePaletteButtonRow = new ActionRowBuilder()
            .setComponents(
               new ButtonBuilder()
                  .setCustomId(componentIds['REGENERATE'])
                  .setLabel('Regenerate')
                  .setStyle(ButtonStyle.Primary)
            );

         async function regenerateAndUpdateMessage(): Promise<void> {

            const colors = (await colormind(
               givenColors.map((color) => color.toHexString())
            )).map((hexColor) => tinycolor(hexColor));
   
            const paletteImageAttachment = await createPaletteImageAttachment(colors);
   
            const paletteGeneratorEmbed = new EmbedBuilder()
               .setColor(0x2f3136)
               .setTitle('Color Palette Generator')
               .setDescription(
                  codeBlock(
                     colors
                        .map((color) => color.toHexString())
                        .join(' | ')
                  )
               )
               .setImage('attachment://color_palette.png');
   
            await interaction.editReply({
               embeds: [paletteGeneratorEmbed],
               components: [regeneratePaletteButtonRow as any],
               files: [paletteImageAttachment]
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

         break;

      }

      default:
         break;

   }

});