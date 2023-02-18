import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'binary',
   description: 'Encode / decode binary.',
   options: [{
      name: 'encode',
      description: 'Encode text to binary.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'text',
         description: 'The text to encode to binary.',
         type: ApplicationCommandOptionType.String,
         required: true
      }]
   }, {
      name: 'decode',
      description: 'Decode binary to text.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'binary',
         description: 'The binary code you want to decode.',
         type: ApplicationCommandOptionType.String,
         required: true
      }]
   }]
}, async (client, interaction) => {

   const subcommand = interaction.options.getSubcommand();

   switch (subcommand) {

      case 'encode': {

         const string = interaction.options.getString('text');

         const binaryString = 
            string
               .split('')
               .map((character) => character.charCodeAt(0).toString(2))
               .join(' ');

         let binaryEncoderEmbed: EmbedBuilder;
         try {

            binaryEncoderEmbed = new EmbedBuilder()
               .setColor(Constants.EMBED_COLOR)
               .setTitle('Binary Encoder')
               .setDescription(
                  codeBlock(string) +
                  codeBlock(`= ${binaryString}`)
               );

               await interaction.reply({
                  embeds: [binaryEncoderEmbed]
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

         const binaryString = interaction.options.getString('binary');

         const string =
            binaryString
               .split(/ +/g)
               .map((binaryPart) => String.fromCharCode(parseInt(binaryPart, 2)))
               .join('');

         let binaryDecoderEmbed: EmbedBuilder;
         try {

            binaryDecoderEmbed = new EmbedBuilder()
               .setColor(Constants.EMBED_COLOR)
               .setTitle('Binary Decoder')
               .setDescription(
                  codeBlock(binaryString) +
                  codeBlock(`= ${string}`)
               );

               await interaction.reply({
                  embeds: [binaryDecoderEmbed]
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