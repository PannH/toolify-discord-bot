import { SlashCommand } from '../../classes';
import tinycolor from 'tinycolor2';
import { createCanvas } from 'canvas';
import { EmbedBuilder, AttachmentBuilder, codeBlock, ApplicationCommandOptionType } from 'discord.js';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'convert-color',
   description: 'Convert a color to HEX, RGB, HSL and HSV formats.',
   options: [{
      name: 'color',
      description: 'The color you want to convert.',
      type: ApplicationCommandOptionType.String,
      required: true
   }]
}, async (client, interaction) => {

   const color = tinycolor(
      interaction.options.getString('color')
   );
   if (!color.isValid())
      return interaction.reply({
         content: 'The color you specified is invalid.',
         ephemeral: true
      });

   await interaction.deferReply();

   const WIDTH = 300;
   const HEIGHT = 50;

   const canvas = createCanvas(WIDTH, HEIGHT);
   const ctx = canvas.getContext('2d');

   ctx.fillStyle = color.toHexString();
   ctx.fillRect(0, 0, WIDTH, HEIGHT);

   const colorImageAttachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'color.png' });

   const colorValuesEmbed = new EmbedBuilder()
      .setColor(Constants.EMBED_COLOR)
      .setTitle('Color Converter')
      .setDescription(
         codeBlock(`HEX | ${color.toHexString()}`) +
         codeBlock(`RGB | ${color.toRgbString()}`) +
         codeBlock(`HSL | ${color.toHslString()}`) +
         codeBlock(`HSV | ${color.toHsvString()}`)
      )
      .setImage('attachment://color.png');

   await interaction.editReply({
      embeds: [colorValuesEmbed],
      files: [colorImageAttachment]
   });

});