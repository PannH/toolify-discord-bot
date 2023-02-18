import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'morse',
   description: 'Encode / decode morse.',
   options: [{
      name: 'encode',
      description: 'Encode text to morse.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'text',
         description: 'The text to encode to morse.',
         type: ApplicationCommandOptionType.String,
         required: true
      }]
   }, {
      name: 'decode',
      description: 'Decode morse to text.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'morse',
         description: 'The morse code you want to decode.',
         type: ApplicationCommandOptionType.String,
         required: true
      }]
   }]
}, async (client, interaction) => {

   const subcommand = interaction.options.getSubcommand();

   const morseCode = [{
      character: 'a',
      code: '.-'
   }, {
      character: 'b',
      code: '-...'
   }, {
      character: 'c',
      code: '-.-.'
   }, {
      character: 'd',
      code: '-..'
   }, {
      character: 'e',
      code: '.'
   }, {
      character: 'f',
      code: '..-.'
   }, {
      character: 'g',
      code: '--.'
   }, {
      character: 'h',
      code: '....'
   }, {
      character: 'i',
      code: '..'
   }, {
      character: 'j',
      code: '.---'
   }, {
      character: 'k',
      code: '-.-'
   }, {
      character: 'l',
      code: '.-..'
   }, {
      character: 'm',
      code: '--'
   }, {
      character: 'n',
      code: '-.'
   }, {
      character: 'o',
      code: '---'
   }, {
      character: 'p',
      code: '.--.'
   }, {
      character: 'q',
      code: '--.-'
   }, {
      character: 'r',
      code: '.-.'
   }, {
      character: 's',
      code: '...'
   }, {
      character: 't',
      code: '-'
   }, {
      character: 'u',
      code: '..-'
   }, {
      character: 'v',
      code: '...-'
   }, {
      character: 'w',
      code: '.--'
   }, {
      character: 'x',
      code: '-..-'
   }, {
      character: 'y',
      code: '-.--'
   }, {
      character: 'z',
      code: '--..'
   }, {
      character: '0',
      code: '-----'
   }, {
      character: '1',
      code: '.----'
   }, {
      character: '2',
      code: '..---'
   }, {
      character: '3',
      code: '...--'
   }, {
      character: '4',
      code: '....-'
   }, {
      character: '5',
      code: '.....'
   }, {
      character: '6',
      code: '-....'
   }, {
      character: '7',
      code: '--...'
   }, {
      character: '8',
      code: '---..'
   }, {
      character: '9',
      code: '----.'
   }]

   switch (subcommand) {

      case 'encode': {

         const string = interaction.options.getString('text');

         const morseString =
            string
               .toLowerCase()
               .split(/ +/g)
               .map((word) => 
                  word
                     .split('')
                     .map((character) => 
                        morseCode.find((morseCode) => morseCode.character === character)?.code ?? character
                     )
                     .join(' ')
               )
               .join(' / ');

         let morseEncoderEmbed: EmbedBuilder;
         try {

            morseEncoderEmbed = new EmbedBuilder()
               .setColor(Constants.EMBED_COLOR)
               .setTitle('Morse Encoder')
               .setDescription(
                  codeBlock(string) +
                  codeBlock(`= ${morseString}`)
               );

               await interaction.reply({
                  embeds: [morseEncoderEmbed]
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

         const morseString = interaction.options.getString('morse');

         const string =
            morseString
               .split('/')
               .map((morsePart) => 
                  morsePart
                     .trim()
                     .split(/ +/g)
                     .map((morseCharacterCode) => 
                        morseCode.find((morseCode) => morseCode.code === morseCharacterCode)?.character ?? morseCharacterCode
                     )
                     .join('')
               )
               .join(' ');

         let morseDecoderEmbed: EmbedBuilder;
         try {

            morseDecoderEmbed = new EmbedBuilder()
               .setColor(Constants.EMBED_COLOR)
               .setTitle('Morse Decoder')
               .setDescription(
                  codeBlock(morseString) +
                  codeBlock(`= ${string}`)
               );

               await interaction.reply({
                  embeds: [morseDecoderEmbed]
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