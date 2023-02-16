import { Autocomplete } from '../../classes';

export default new Autocomplete('convert-units', async (client, interaction) => {

   const unitCategories: { [key: string]: { name: string; value: string }[] } = {
      length: [{
         name: 'Centimeters',
         value: 'centimeters'
      }, {
         name: 'Decameters',
         value: 'decameters'
      }, {
         name: 'Decimeters',
         value: 'decimeters'
      }, {
         name: 'Feet',
         value: 'feet'
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
         name: 'Inches',
         value: 'inches'
      }, {
         name: 'Kilometers',
         value: 'kilometers'
      }, {
         name: 'Megameters',
         value: 'megameters'
      }, {
         name: 'Meters',
         value: 'meters'
      }, {
         name: 'Micrometers',
         value: 'micrometers'
      }, {
         name: 'Millimeters',
         value: 'millimeters'
      }, {
         name: 'Nanometers',
         value: 'nanometers'
      }, {
         name: 'Nautical miles',
         value: 'nautical miles'
      }, {
         name: 'Petameters',
         value: 'petameters'
      }, {
         name: 'Picas',
         value: 'picas'
      }, {
         name: 'Picometers',
         value: 'picometers'
      }, {
         name: 'Miles',
         value: 'miles'
      }, {
         name: 'Points',
         value: 'points'
      }, {
         name: 'Terameters',
         value: 'terameters'
      }, {
         name: 'Yards',
         value: 'yards'
      }],
      mass: [{
         name: 'US tons',
         value: 'US tons'
      }, {
         name: 'Centigrams',
         value: 'centigrams'
      }, {
         name: 'Decagrams',
         value: 'decagrams'
      }, {
         name: 'Decigrams',
         value: 'decigrams'
      }, {
         name: 'Displacement tons',
         value: 'displacement tons'
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
         name: 'Imperial tons',
         value: 'imperial tons'
      }, {
         name: 'Kilograms',
         value: 'kilograms'
      }, {
         name: 'Long tons',
         value: 'long tons'
      }, {
         name: 'Short tons',
         value: 'short tons'
      }, {
         name: 'Megagrams',
         value: 'megagrams'
      }, {
         name: 'Metric tons',
         value: 'metric tons'
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
      }],
      temperature: [{
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
         name: 'Picokelvins',
         value: 'picokelvins'
      }, {
         name: 'Petakelvins',
         value: 'petakelvins'
      }, {
         name: 'Rankine',
         value: 'rankine'
      }, {
         name: 'Terakelvins',
         value: 'terakelvins'
      }],
      data: [{
         name: 'Bits',
         value: 'bits'
      }, {
         name: 'Bytes',
         value: 'bytes'
      }, {
         name: 'Centibits',
         value: 'centibits'
      }, {
         name: 'Centibytes',
         value: 'centibytes'
      }, {
         name: 'Decabits',
         value: 'decabits'
      }, {
         name: 'Decabytes',
         value: 'decabytes'
      }, {
         name: 'Decibits',
         value: 'decibits'
      }, {
         name: 'Decibytes',
         value: 'decibytes'
      }, {
         name: 'Femtobits',
         value: 'femtobits'
      }, {
         name: 'Femtobytes',
         value: 'femtobytes'
      }, {
         name: 'Gibibits',
         value: 'gibibits'
      }, {
         name: 'Gibibytes',
         value: 'gibibytes'
      }, {
         name: 'Gigabits',
         value: 'gigabits'
      }, {
         name: 'Gigabytes',
         value: 'gigabytes'
      }, {
         name: 'Halfbytes',
         value: 'halfbytes'
      }, {
         name: 'Hectobits',
         value: 'hectobits'
      }, {
         name: 'Hectobytes',
         value: 'hectobytes'
      }, {
         name: 'Hextets',
         value: 'hextets'
      }, {
         name: 'Kibibits',
         value: 'kibibits'
      }, {
         name: 'Kibibytes',
         value: 'kibibytes'
      }, {
         name: 'Kilobits',
         value: 'kilobits'
      }, {
         name: 'Kilobytes',
         value: 'kilobytes'
      }, {
         name: 'Mebibits',
         value: 'mebibits'
      }, {
         name: 'Mebibytes',
         value: 'mebibytes'
      }, {
         name: 'Megabits',
         value: 'megabits'
      }, {
         name: 'Megabytes',
         value: 'megabytes'
      }, {
         name: 'Microbits',
         value: 'microbits'
      }, {
         name: 'Microbytes',
         value: 'microbytes'
      }, {
         name: 'Millibits',
         value: 'millibits'
      }, {
         name: 'Millibytes',
         value: 'millibytes'
      }, {
         name: 'Nanobits',
         value: 'nanobits'
      }, {
         name: 'Nanobytes',
         value: 'nanobytes'
      }, {
         name: 'Nibbles',
         value: 'nibbles'
      }, {
         name: 'Pebibits',
         value: 'pebibits'
      }, {
         name: 'Pebibytes',
         value: 'pebibytes'
      }, {
         name: 'Petabits',
         value: 'petabits'
      }, {
         name: 'Petabytes',
         value: 'petabytes'
      }, {
         name: 'Picobits',
         value: 'picobits'
      }, {
         name: 'Picobytes',
         value: 'picobytes'
      }, {
         name: 'Tebibits',
         value: 'tebibits'
      }, {
         name: 'Tebibytes',
         value: 'tebibytes'
      }, {
         name: 'Terabits',
         value: 'terabits'
      }, {
         name: 'Terabytes',
         value: 'terabytes'
      }],
      energy: [{
         name: 'Centijoules',
         value: 'centijoules'
      }, {
         name: 'Decajoules',
         value: 'decajoules'
      }, {
         name: 'Decijoules',
         value: 'decijoules'
      }, {
         name: 'Femtojoules',
         value: 'femtojoules'
      }, {
         name: 'Gigajoules',
         value: 'gigajoules'
      }, {
         name: 'Hectojoules',
         value: 'hectojoules'
      }, {
         name: 'Joules',
         value: 'joules'
      }, {
         name: 'Kilojoules',
         value: 'kilojoules'
      }, {
         name: 'Kilowatt-hour',
         value: 'kilowatt-hour'
      }, {
         name: 'Megajoules',
         value: 'megajoules'
      }, {
         name: 'Microjoules',
         value: 'microjoules'
      }, {
         name: 'Millijoules',
         value: 'millijoules'
      }, {
         name: 'Nanojoules',
         value: 'nanojoules'
      }, {
         name: 'Petajoules',
         value: 'petajoules'
      }, {
         name: 'Picojoules',
         value: 'picojoules'
      }, {
         name: 'Terajoules',
         value: 'terajoules'
      }]
   };

   const subcommand = interaction.options.getSubcommand();
   const focusValue = interaction.options.getFocused();

   const matchingChoices = 
      unitCategories[subcommand]
         .filter((unitChoice) => unitChoice.name.toLowerCase().includes(focusValue.toLowerCase()))
         .slice(0, 25);
         
   await interaction.respond(matchingChoices);

});