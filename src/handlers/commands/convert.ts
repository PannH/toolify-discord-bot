import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { convert, type Temperature } from 'convert';

export default new SlashCommand({
   name: 'convert',
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
         choices: [{
            name: 'Kilometers',
            value: 'kilometers'
         }, {
            name: 'Meters',
            value: 'meters'
         }, {
            name: 'Centimeters',
            value: 'centimeters'
         }, {
            name: 'Millimeters',
            value: 'millimeters'
         }, {
            name: 'Micrometers',
            value: 'micrometers'
         }, {
            name: 'Nanometers',
            value: 'nanometers'
         }, {
            name: 'Miles',
            value: 'miles'
         }, {
            name: 'Yards',
            value: 'yards'
         }, {
            name: 'Feet',
            value: 'feet'
         }, {
            name: 'Inches',
            value: 'inches'
         }, {
            name: 'Nautical miles',
            value: 'nautical miles'
         }, {
            name: 'Decameters',
            value: 'decameters'
         }, {
            name: 'Decimeters',
            value: 'decimeters'
         }, {
            name: 'Femtometers',
            value: 'femtometers'
         }, {
            name: 'Gigameters',
            value: 'gigameters'
         }, {
            name: 'Hectometers',
            value: 'hectometers'
         }, {
            name: 'Magemeters',
            value: 'megameters'
         }, {
            name: 'Petameters',
            value: 'petameters'
         }, {
            name: 'Picometers',
            value: 'picometers'
         }, {
            name: 'Points',
            value: 'points'
         }, {
            name: 'Terameters',
            value: 'terameters'
         }]
      }, {
         name: 'to',
         description: 'The unit to convert the value to.',
         type: ApplicationCommandOptionType.String,
         required: true,
         choices: [{
            name: 'Kilometers',
            value: 'kilometers'
         }, {
            name: 'Meters',
            value: 'meters'
         }, {
            name: 'Centimeters',
            value: 'centimeters'
         }, {
            name: 'Millimeters',
            value: 'millimeters'
         }, {
            name: 'Micrometers',
            value: 'micrometers'
         }, {
            name: 'Nanometers',
            value: 'nanometers'
         }, {
            name: 'Miles',
            value: 'miles'
         }, {
            name: 'Yards',
            value: 'yards'
         }, {
            name: 'Feet',
            value: 'feet'
         }, {
            name: 'Inches',
            value: 'inches'
         }, {
            name: 'Nautical miles',
            value: 'nautical miles'
         }, {
            name: 'Decameters',
            value: 'decameters'
         }, {
            name: 'Decimeters',
            value: 'decimeters'
         }, {
            name: 'Femtometers',
            value: 'femtometers'
         }, {
            name: 'Gigameters',
            value: 'gigameters'
         }, {
            name: 'Hectometers',
            value: 'hectometers'
         }, {
            name: 'Magemeters',
            value: 'megameters'
         }, {
            name: 'Petameters',
            value: 'petameters'
         }, {
            name: 'Picometers',
            value: 'picometers'
         }, {
            name: 'Points',
            value: 'points'
         }, {
            name: 'Terameters',
            value: 'terameters'
         }]
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
         choices: [{
            name: 'Centigrams',
            value: 'centigrams'
         }, {
            name: 'Decagrams',
            value: 'decagrams'
         }, {
            name: 'Decigrams',
            value: 'decigrams'
         }, {
            name: 'Femtograms',
            value: 'femtograms'
         }, {
            name: 'Gigagrams',
            value: 'gigagrams'
         }, {
            name: 'Grams',
            value: 'grams'
         }, {
            name: 'Hectograms',
            value: 'hectograms'
         }, {
            name: 'Kilograms',
            value: 'kilograms'
         }, {
            name: 'Megagrams',
            value: 'megagrams'
         }, {
            name: 'Micrograms',
            value: 'micrograms'
         }, {
            name: 'Milligrams',
            value: 'milligrams'
         }, {
            name: 'Nanograms',
            value: 'nanograms'
         }, {
            name: 'Ounces',
            value: 'ounces'
         }, {
            name: 'Petagrams',
            value: 'petagrams'
         }, {
            name: 'Picograms',
            value: 'picograms'
         }, {
            name: 'Pounds',
            value: 'pounds'
         }, {
            name: 'Stones',
            value: 'stones'
         }, {
            name: 'Teragrams',
            value: 'teragrams'
         }, {
            name: 'Displacement tons',
            value: 'displacement tons'
         }, {
            name: 'US tons',
            value: 'US tons'
         }, {
            name: 'Imperial tons',
            value: 'imperial tons'
         }, {
            name: 'Long tons',
            value: 'long tons'
         }, {
            name: 'Metric tons',
            value: 'metric tons'
         }, {
            name: 'Short tons',
            value: 'short tons'
         }]
      }, {
         name: 'to',
         description: 'The unit to convert the value to.',
         type: ApplicationCommandOptionType.String,
         required: true,
         choices: [{
            name: 'Centigrams',
            value: 'centigrams'
         }, {
            name: 'Decagrams',
            value: 'decagrams'
         }, {
            name: 'Decigrams',
            value: 'decigrams'
         }, {
            name: 'Femtograms',
            value: 'femtograms'
         }, {
            name: 'Gigagrams',
            value: 'gigagrams'
         }, {
            name: 'Grams',
            value: 'grams'
         }, {
            name: 'Hectograms',
            value: 'hectograms'
         }, {
            name: 'Kilograms',
            value: 'kilograms'
         }, {
            name: 'Megagrams',
            value: 'megagrams'
         }, {
            name: 'Micrograms',
            value: 'micrograms'
         }, {
            name: 'Milligrams',
            value: 'milligrams'
         }, {
            name: 'Nanograms',
            value: 'nanograms'
         }, {
            name: 'Ounces',
            value: 'ounces'
         }, {
            name: 'Petagrams',
            value: 'petagrams'
         }, {
            name: 'Picograms',
            value: 'picograms'
         }, {
            name: 'Pounds',
            value: 'pounds'
         }, {
            name: 'Stones',
            value: 'stones'
         }, {
            name: 'Teragrams',
            value: 'teragrams'
         }, {
            name: 'Displacement tons',
            value: 'displacement tons'
         }, {
            name: 'US tons',
            value: 'US tons'
         }, {
            name: 'Imperial tons',
            value: 'imperial tons'
         }, {
            name: 'Long tons',
            value: 'long tons'
         }, {
            name: 'Metric tons',
            value: 'metric tons'
         }, {
            name: 'Short tons',
            value: 'short tons'
         }]
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
         choices: [{
            name: 'Celsius',
            value: 'celsius'
         }, {
            name: 'Centikelvins',
            value: 'centikelvins'
         }, {
            name: 'Decakelvins',
            value: 'decakelvins'
         }, {
            name: 'Decikelvins',
            value: 'decikelvins'
         }, {
            name: 'Fahrenheit',
            value: 'fahrenheit'
         }, {
            name: 'Femtokelvins',
            value: 'femtokelvins'
         }, {
            name: 'Gigakelvins',
            value: 'gigakelvins'
         }, {
            name: 'Hectokelvins',
            value: 'hectokelvins'
         }, {
            name: 'Kelvins',
            value: 'kelvins'
         }, {
            name: 'Kilokelvins',
            value: 'kilokelvins'
         }, {
            name: 'Megakelvins',
            value: 'megakelvins'
         }, {
            name: 'Microkelvins',
            value: 'microkelvins'
         }, {
            name: 'Millikelvins',
            value: 'millikelvins'
         }, {
            name: 'Nanokelvins',
            value: 'nanokelvins'
         }, {
            name: 'Petakelvins',
            value: 'petakelvins'
         }, {
            name: 'Picokelvins',
            value: 'picokelvins'
         }, {
            name: 'Terakelvins',
            value: 'terakelvins'
         }, {
            name: 'Rankine',
            value: 'rankine'
         }]
      }, {
         name: 'to',
         description: 'The unit to convert the value to.',
         type: ApplicationCommandOptionType.String,
         required: true,
         choices: [{
            name: 'Celsius',
            value: 'celsius'
         }, {
            name: 'Centikelvins',
            value: 'centikelvins'
         }, {
            name: 'Decakelvins',
            value: 'decakelvins'
         }, {
            name: 'Decikelvins',
            value: 'decikelvins'
         }, {
            name: 'Fahrenheit',
            value: 'fahrenheit'
         }, {
            name: 'Femtokelvins',
            value: 'femtokelvins'
         }, {
            name: 'Gigakelvins',
            value: 'gigakelvins'
         }, {
            name: 'Hectokelvins',
            value: 'hectokelvins'
         }, {
            name: 'Kelvins',
            value: 'kelvins'
         }, {
            name: 'Kilokelvins',
            value: 'kilokelvins'
         }, {
            name: 'Megakelvins',
            value: 'megakelvins'
         }, {
            name: 'Microkelvins',
            value: 'microkelvins'
         }, {
            name: 'Millikelvins',
            value: 'millikelvins'
         }, {
            name: 'Nanokelvins',
            value: 'nanokelvins'
         }, {
            name: 'Petakelvins',
            value: 'petakelvins'
         }, {
            name: 'Picokelvins',
            value: 'picokelvins'
         }, {
            name: 'Terakelvins',
            value: 'terakelvins'
         }, {
            name: 'Rankine',
            value: 'rankine'
         }]
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