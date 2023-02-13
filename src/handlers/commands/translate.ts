import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { Translator, TextResult } from 'deepl-node';

export default new SlashCommand({
   name: 'translate',
   description: 'Translate text.',
   options: [{
      name: 'text',
      description: 'The text you want to translate',
      type: ApplicationCommandOptionType.String,
      required: true
   }, {
      name: 'from',
      description: 'The language in which the text is written.',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true
   }, {
      name: 'to',
      description: 'The language you want to translate the text to.',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true
   }]
}, async (client, interaction) => {

   await interaction.deferReply();

   const sourceText = interaction.options.getString('text');
   const sourceLanguage: any = interaction.options.getString('from');
   const targetLanguage: any = interaction.options.getString('to');

   const translator = new Translator(process.env.DEEPL_API_KEY);
   
   let translation: TextResult;
   try {

      translation = await translator.translateText(sourceText, sourceLanguage === 'auto' ? null : sourceLanguage, targetLanguage);      

   } catch (error) {

      return interaction.editReply({
         content: 'An error has occured. Try to wait for the autocompletion to prompt you a supported language.'
      });

   }

   const translatorEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle('Translator')
      .setDescription(
         codeBlock(sourceText) +
         codeBlock(`= ${translation.text}`)
      );

   await interaction.editReply({
      embeds: [translatorEmbed]
   });

});