import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../classes';
import axios from 'axios';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'dictionary',
   description: 'Search for a word definition in the dictionary.',
   options: [{
      name: 'word',
      description: 'The word you want to search.',
      type: ApplicationCommandOptionType.String,
      required: true
   }]
}, async (client, interaction) => {

   const wordQuery = interaction.options.getString('word');

   await interaction.deferReply();

   let wordData: any;
   try {

      const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(wordQuery)}`);
      wordData = data[0];

   } catch (_) {
     
      return interaction.editReply({
         content: 'No definition found for the provided word.'
      });

   };

   const topEmbed = new EmbedBuilder()
      .setColor(Constants.EMBED_COLOR)
      .setTitle(`Dictionary`)
      .setDescription(`${wordData.word} (${wordData.meanings[0].partOfSpeech}${wordData.phonetic ? `, ${wordData.phonetic}` : ''})`)

   const DISPLAYED_DEFINITIONS = 3;

   const definitionEmbeds = wordData.meanings[0].definitions.map((definition: any, index: number) => {

      return new EmbedBuilder()
         .setColor(Constants.EMBED_COLOR)
         .setDescription(
            `**${index + 1}.** ${definition.definition}\n` +
            (definition.example ? `e.g.: *${definition.example}*` : '')
         )

   }).slice(0, DISPLAYED_DEFINITIONS);

   const undisplayedDefinitionsCount = wordData.meanings[0].definitions.length - DISPLAYED_DEFINITIONS;

   const bottomEmbed = new EmbedBuilder()
      .setColor(Constants.EMBED_COLOR)
      .setTitle('Sources')
      .setDescription(
         (undisplayedDefinitionsCount >= 1 ? `*${undisplayedDefinitionsCount} more definition(s)...*\n` : '') +
         wordData.sourceUrls.join(', ')
      );

   await interaction.editReply({
      embeds: [topEmbed, ...definitionEmbeds, bottomEmbed]
   });


});