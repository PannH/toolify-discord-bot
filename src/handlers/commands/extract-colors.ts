import { SlashCommand } from '../../classes';
import tinycolor from 'tinycolor2';
import { createCanvas } from 'canvas';
import { EmbedBuilder, AttachmentBuilder, codeBlock, ApplicationCommandOptionType } from 'discord.js';
import { getPaletteFromURL } from 'color-thief-node';

export default new SlashCommand({
   name: 'extract-colors',
   description: 'Extract colors from an image.',
   options: [{
      name: 'image',
      description: 'The image you want the colors from.',
      type: ApplicationCommandOptionType.Attachment,
      required: true
   }]
}, async (client, interaction) => {

   const imageAttachment = interaction.options.getAttachment('image');

   if (!imageAttachment?.contentType?.startsWith('image/'))
      return interaction.reply({
         content: 'You must specify an image.',
         ephemeral: true
      })

   await interaction.deferReply();

   const colors = (await getPaletteFromURL(imageAttachment.url, 5)).map((rgb) => tinycolor({ r: rgb[0], g: rgb[1], b: rgb[2] }));

   const WIDTH = 500;
   const HEIGHT = 50;
   const COLOR_SECTION_WIDTH = WIDTH / colors.length;

   const canvas = createCanvas(WIDTH, HEIGHT);
   const ctx = canvas.getContext('2d');

   colors.forEach((color, index) => {

      ctx.fillStyle = color.toHexString();
      ctx.fillRect(index * COLOR_SECTION_WIDTH, 0, COLOR_SECTION_WIDTH, HEIGHT);

   });

   const colorsEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle('Extract Colors')
      .setThumbnail(imageAttachment.url)
      .setDescription(
         codeBlock(
            colors
               .map((color) => color.toHexString())
               .join(' | ')
         )
      )
      .setImage('attachment://colors.png');

   const colorsImageAttachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'colors.png' });

   await interaction.editReply({
      embeds: [colorsEmbed],
      files: [colorsImageAttachment]
   });

});