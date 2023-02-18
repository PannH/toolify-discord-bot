import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'shorten-url',
   description: 'Shorten a URL.',
   options: [{
      name: 'url',
      description: 'The URL you want to shorten.',
      type: ApplicationCommandOptionType.String,
      required: true
   }]
}, async (client, interaction) => {

   const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;

   const url = interaction.options.getString('url');

   if (!urlRegex.test(url))
      return interaction.reply({
         content: 'You must provide a valid URL, for example: `https://example.com/`.',
         ephemeral: true
      });

   await interaction.deferReply();

   const { data } = await axios.get('https://cutt.ly/api/api.php', {
      params: {
         key: process.env.CUTTLY_API_KEY,
         short: url,
         public: 0
      }
   });

   const urlShortenerEmbed = new EmbedBuilder()
      .setColor(Constants.EMBED_COLOR)
      .setTitle('URL Shortener')
      .setDescription(
         codeBlock(data.url.fullLink) +
         codeBlock(`= ${data.url.shortLink}`)
      );

   await interaction.editReply({
      embeds: [urlShortenerEmbed]
   });

});