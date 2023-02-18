import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'hex',
   description: 'Encode / decode HEX.',
   options: [{
      name: 'encode',
      description: 'Encode text to HEX.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'text',
         description: 'The text to encode to HEX.',
         type: ApplicationCommandOptionType.String,
         required: true
      }]
   }, {
      name: 'decode',
      description: 'Decode HEX to text.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'hex',
         description: 'The HEX code you want to decode.',
         type: ApplicationCommandOptionType.String,
         required: true
      }]
   }]
}, async (client, interaction) => {

   const subcommand = interaction.options.getSubcommand();

   switch (subcommand) {

      case 'encode': {

         const string = interaction.options.getString('text');

         const hexString = Buffer.from(string, 'utf8').toString('hex');

         let hexEncoderEmbed: EmbedBuilder;
         try {

            hexEncoderEmbed = new EmbedBuilder()
               .setColor(Constants.EMBED_COLOR)
               .setTitle('HEX Encoder')
               .setDescription(
                  codeBlock(string) +
                  codeBlock(`= ${hexString}`)
               );

               await interaction.reply({
                  embeds: [hexEncoderEmbed]
               });

         } catch (_) {
            
            await interaction.reply({
               content: 'The result is too long for a Discord message.',
               ephemeral: true
            })

         }

         break;

      }

      case 'decode': {

         const hexString = interaction.options.getString('hex');

         const string = Buffer.from(hexString, 'hex').toString('utf8');

         let hexDecoderEmbed: EmbedBuilder;
         try {

            hexDecoderEmbed = new EmbedBuilder()
               .setColor(Constants.EMBED_COLOR)
               .setTitle('HEX Decoder')
               .setDescription(
                  codeBlock(hexString) +
                  codeBlock(`= ${string}`)
               );

               await interaction.reply({
                  embeds: [hexDecoderEmbed]
               });

         } catch (_) {
            
            await interaction.reply({
               content: 'The result is too long for a Discord message.',
               ephemeral: true
            })

         }

         break;

      }

      default:
         break;

   }

});