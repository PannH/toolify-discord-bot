import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import axios from 'axios';

export default new SlashCommand({
   name: 'country',
   description: 'Display information about a country.',
   options: [{
      name: 'name',
      description: 'The name of the country.',
      type: ApplicationCommandOptionType.String,
      required: true
   }]
}, async (client, interaction) => {

   const countryNameQuery = interaction.options.getString('name').toLowerCase();

   await interaction.deferReply();

   const { data } = await axios.get('https://countryapi.io/api/all', {
      params: {
         apikey: process.env.COUNTRY_API_KEY
      }
   });

   const countries: any[] = Object.values(data);
   const country = countries.find((country) => country.name.toLowerCase() === countryNameQuery) ?? countries.filter((country) => country.name.toLowerCase().includes(countryNameQuery))[0];

   if (!country)
      return interaction.editReply({
         content: 'No country found for the given name.'
      });

   const { format } = new Intl.NumberFormat('en-US');

   const countryEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle(`Country - ${country.name}`)
      .setThumbnail(`https://flagcdn.com/w320/${country.alpha2Code.toLowerCase()}.png`)
      .setDescription(
         codeBlock(`Official Name | ${country.official_name}`) +
         codeBlock(`Capital       | ${country.capital}`) +
         codeBlock(`Region        | ${country.subregion}`) +
         codeBlock(`Population    | ${format(country.population)}`) +
         codeBlock(`Area          | ${format(country.area)} Km²`) +
         codeBlock(`Currencies    | ${Object.values(country.currencies).map((currency: any) => `${currency.name} (${currency.symbol})`).join(', ')}`) +
         codeBlock(`Languages     | ${Object.values(country.languages).join(', ')}`) +
         codeBlock(`ISO Codes     | ${country.alpha2Code} / ${country.alpha3Code}`) +
         codeBlock(`Calling Code  | ${country.callingCode}`) +
         codeBlock(`Timezones     | ${country.timezones.join(', ')}`)
      );
   
   await interaction.editReply({
      embeds: [countryEmbed]
   });

});