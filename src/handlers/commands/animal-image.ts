import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import axios from 'axios';

export default new SlashCommand({
   name: 'animal-image',
   description: 'Generate random animal images.',
   options: [{
      name: 'bird',
      description: 'Generate a random image of a bird.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'cat',
      description: 'Generate a random image of a cat.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'dog',
      description: 'Generate a random image of a dog.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'fox',
      description: 'Generate a random image of a fox.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'kangaroo',
      description: 'Generate a random image of a kangaroo.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'koala',
      description: 'Generate a random image of a koala.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'panda',
      description: 'Generate a random image of a panda.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'raccoon',
      description: 'Generate a random image of a raccoon.',
      type: ApplicationCommandOptionType.Subcommand
   }]
}, async (client, interaction) => {

   const subcommand = interaction.options.getSubcommand();

   await interaction.deferReply();

   const { data } = await axios.get(`https://some-random-api.ml/animal/${subcommand}`);

   const randomAnimalImageEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle(`Random Animal Image Generator (${subcommand})`)
      .setImage(data.image);

   await interaction.editReply({
      embeds: [randomAnimalImageEmbed]
   });

});