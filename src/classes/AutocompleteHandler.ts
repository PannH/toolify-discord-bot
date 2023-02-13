import { Client, Autocomplete, Logger } from './';
import { Collection } from 'discord.js';
import { readdirSync } from 'fs';

export default class AutocompleteHandler extends Collection<string, Autocomplete> {

   constructor() {

      super();

      for (const fileName of readdirSync('./dist/handlers/autocompletes/')) {

         const autocomplete: Autocomplete = require(`../handlers/autocompletes/${fileName}`).default;

         this.set(autocomplete.commandName, autocomplete);

      }

      Logger.info(`Handling ${this.size} autocompletes`);

   }

}