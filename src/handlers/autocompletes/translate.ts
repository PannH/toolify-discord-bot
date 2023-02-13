import { Autocomplete } from '../../classes';

export default new Autocomplete('translate', async (client, interaction) => {

   const languages: { [key: string]: { name: string; value: string; }[] } = {
      from: [{
         name: 'Detect language',
         value: 'auto'
      }, {
         name: 'Bulgarian',
         value: 'bg'
      }, {
         name: 'Czech',
         value: 'cs'
      }, {
         name: 'Danish',
         value: 'da'
      }, {
         name: 'German',
         value: 'de'
      }, {
         name: 'Greek',
         value: 'el'
      }, {
         name: 'English',
         value: 'en'
      }, {
         name: 'Spanish',
         value: 'es'
      }, {
         name: 'Estonian',
         value: 'et'
      }, {
         name: 'Finnish',
         value: 'fi'
      }, {
         name: 'French',
         value: 'fr'
      }, {
         name: 'Hungarian',
         value: 'hu'
      }, {
         name: 'Indonesian',
         value: 'id'
      }, {
         name: 'Italian',
         value: 'it'
      }, {
         name: 'Japanese',
         value: 'ja'
      }, {
         name: 'Korean',
         value: 'ko'
      }, {
         name: 'Lithuanian',
         value: 'lt'
      }, {
         name: 'Latvian',
         value: 'lv'
      }, {
         name: 'Norwegian',
         value: 'nb'
      }, {
         name: 'Dutch',
         value: 'nl'
      }, {
         name: 'Polish',
         value: 'pl'
      }, {
         name: 'Portuguese',
         value: 'pt'
      }, {
         name: 'Romanian',
         value: 'ro'
      }, {
         name: 'Russian',
         value: 'ru'
      }, {
         name: 'Slovak',
         value: 'sk'
      }, {
         name: 'Slovenian',
         value: 'sl'
      }, {
         name: 'Swedish',
         value: 'sv'
      }, {
         name: 'Turkish',
         value: 'tr'
      }, {
         name: 'Ukrainian',
         value: 'uk'
      }, {
         name: 'Chinese',
         value: 'zh'
      }],
      to: [{
         name: 'Bulgarian',
         value: 'bg'
      }, {
         name: 'Czech',
         value: 'cs'
      }, {
         name: 'Danish',
         value: 'da'
      }, {
         name: 'German',
         value: 'de'
      }, {
         name: 'Greek',
         value: 'el'
      }, {
         name: 'English (British)',
         value: 'en-GB'
      }, {
         name: 'English (American)',
         value: 'en-US'
      }, {
         name: 'Spanish',
         value: 'es'
      }, {
         name: 'Estonian',
         value: 'et'
      }, {
         name: 'Finnish',
         value: 'fi'
      }, {
         name: 'French',
         value: 'fr'
      }, {
         name: 'Hungarian',
         value: 'hu'
      }, {
         name: 'Indonesian',
         value: 'id'
      }, {
         name: 'Italian',
         value: 'it'
      }, {
         name: 'Japanese',
         value: 'ja'
      }, {
         name: 'Korean',
         value: 'ko'
      }, {
         name: 'Lithuanian',
         value: 'lt'
      }, {
         name: 'Latvian',
         value: 'lv'
      }, {
         name: 'Norwegian',
         value: 'nb'
      }, {
         name: 'Dutch',
         value: 'nl'
      }, {
         name: 'Polish',
         value: 'pl'
      }, {
         name: 'Portuguese (Brazilian)',
         value: 'pt-BR'
      }, {
         name: 'Romanian',
         value: 'ro'
      }, {
         name: 'Russian',
         value: 'ru'
      }, {
         name: 'Slovak',
         value: 'sk'
      }, {
         name: 'Slovenian',
         value: 'sl'
      }, {
         name: 'Swedish',
         value: 'sv'
      }, {
         name: 'Turkish',
         value: 'tr'
      }, {
         name: 'Ukrainian',
         value: 'uk'
      }, {
         name: 'Chinese (Simplified)',
         value: 'zh'
      }]
   }

   const focus = interaction.options.getFocused(true);

   const matchingChoices =
      focus.value
         ? languages[focus.name]
            .filter((languageChoice) => languageChoice.name.toLowerCase().includes(focus.value.toLowerCase()))
            .slice(0, 25)
         : languages[focus.name].slice(0, 25);
         
   await interaction.respond(matchingChoices);

});