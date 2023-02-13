import type { AutocompleteCallback } from '../types';

export default class Autocomplete {

   public commandName: string;
   public callback: AutocompleteCallback;

   constructor(commandName: string, callback: AutocompleteCallback) {

      this.commandName = commandName;
      this.callback = callback;

   }

}