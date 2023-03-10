import { Event } from '../../classes';
import type { Interaction } from 'discord.js';

export default new Event('interactionCreate', async (client, interaction: Interaction) => {

   if (interaction.isChatInputCommand()) {

      const slashCommand = client.slashCommands.get(interaction.commandName);

      await slashCommand.callback.call(null, client, interaction);

   } else if (interaction.isAutocomplete()) {

      const autocomplete = client.autocompletes.get(interaction.commandName);

      await autocomplete.callback.call(null, client, interaction);

   }

}, false);