import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { convert } from 'convert';

export default new SlashCommand({
   name: 'convert-units',
   description: 'Make unit conversions.',
   options: [{
      name: 'length',
      description: 'Convert length units.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'value',
         description: 'The value to convert.',
         type: ApplicationCommandOptionType.Number,
         required: true
      }, {
         name: 'from',
         description: 'The value\'s unit.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }, {
         name: 'to',
         description: 'The unit to convert the value to.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }]
   }, {
      name: 'mass',
      description: 'Convert mass units.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'value',
         description: 'The value to convert.',
         type: ApplicationCommandOptionType.Number,
         required: true
      }, {
         name: 'from',
         description: 'The value\'s unit.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }, {
         name: 'to',
         description: 'The unit to convert the value to.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }]
   }, {
      name: 'temperature',
      description: 'Convert temperature units.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'value',
         description: 'The value to convert.',
         type: ApplicationCommandOptionType.Number,
         required: true
      }, {
         name: 'from',
         description: 'The value\'s unit.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }, {
         name: 'to',
         description: 'The unit to convert the value to.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }]
   }, {
      name: 'data',
      description: 'Convert data units.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'value',
         description: 'The value to convert.',
         type: ApplicationCommandOptionType.Number,
         required: true
      }, {
         name: 'from',
         description: 'The value\'s unit.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }, {
         name: 'to',
         description: 'The unit to convert the value to.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }]
   }, {
      name: 'energy',
      description: 'Convert energy units.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'value',
         description: 'The value to convert.',
         type: ApplicationCommandOptionType.Number,
         required: true
      }, {
         name: 'from',
         description: 'The value\'s unit.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }, {
         name: 'to',
         description: 'The unit to convert the value to.',
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true
      }]
   }]
}, async (client, interaction) => {

   const { format } = new Intl.NumberFormat('en-US');

   const subcommand = interaction.options.getSubcommand();
   const fromUnit: any = interaction.options.getString('from');
   const toUnit: any = interaction.options.getString('to');

   const rawValue = interaction.options.getNumber('value');
   const formattedValue = format(rawValue) === '0' ? rawValue : format(rawValue);

   const rawConvertedValue: any = convert(rawValue, fromUnit).to(toUnit);
   const formattedConvertedValue = format(rawConvertedValue) === '0' ? rawConvertedValue : format(rawConvertedValue);

   const converterEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle(`Unit Converter (${subcommand})`)
      .setDescription(
         codeBlock(`${formattedValue} ${fromUnit}`) +
         codeBlock(`= ${formattedConvertedValue} ${toUnit}`)
      );

   await interaction.reply({
      embeds: [converterEmbed]
   });

});