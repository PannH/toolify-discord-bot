import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import axios from 'axios';

export default new SlashCommand({
   name: 'redirects',
   description: 'Check the redirects from a website URL.',
   options: [{
      name: 'url',
      description: 'The website URL you want to check redirects from.',
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

   const redirects = [];

   await axios.get(url, {
      beforeRedirect: (redirect) => redirects.push(redirect.href)
   });

   if (!redirects.length)
      return interaction.editReply({
         content: 'This website has no redirect.'
      });

   const redirectsEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle('Redirect Checker')
      .setDescription(
         codeBlock(`Website URL | ${url}`)
      )
      .setFields({
         name: 'Redirects',
         value: codeBlock(
            redirects
               .map((redirect, index) => `${index + 1}. ${redirect}`)
               .join('\n')
         )
      });

   await interaction.editReply({
      embeds: [redirectsEmbed]
   });
   
});