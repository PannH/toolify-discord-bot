import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import qrCode from 'qrcode';

export default new SlashCommand({
   name: 'qrcode',
   description: 'Generate a QR code.',
   options: [{
      name: 'redirect',
      description: 'The text or URL the QR code redirects to.',
      type: ApplicationCommandOptionType.String,
      required: true
   }]
}, async (client, interaction) => {

   const redirectText = interaction.options.getString('redirect');

   await interaction.deferReply();

   const qrCodeBuffer = await qrCode.toBuffer(redirectText, {
      width: 400,
      margin: 2
   });

   const qrCodeImageAttachment = new AttachmentBuilder(qrCodeBuffer, { name: 'qr_code.png' });

   const qrCodeEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle('QR Code Generator')
      .setDescription(
         codeBlock(`Redirect | ${redirectText}`)
      )
      .setImage('attachment://qr_code.png');

   await interaction.editReply({
      embeds: [qrCodeEmbed],
      files: [qrCodeImageAttachment]
   });

});