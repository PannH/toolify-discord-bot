import { Autocomplete } from '../../classes';
import { RadioBrowserApi } from 'radio-browser-api';
import { randomUUID } from 'crypto';

export default new Autocomplete('radio', async (client, interaction) => {

   const radioBrowserAPI = new RadioBrowserApi(randomUUID(), true);

   const focusValue = interaction.options.getFocused();

   const matchingRadioStations = await radioBrowserAPI.searchStations({
      name: focusValue,
      limit: 25
   });

   const choices = 
      matchingRadioStations
         .map((radioStation) => ({
            name: `${radioStation.name} (${radioStation.countryCode})`,
            value: radioStation.id
         }));
         
   await interaction.respond(choices);

});