import type { ChatInputApplicationCommandData } from 'discord.js';
import type { SlashCommandCallback } from '../types';

export default class SlashCommand {

   public data: ChatInputApplicationCommandData;
   public callback: SlashCommandCallback;

   constructor(data: ChatInputApplicationCommandData, callback: SlashCommandCallback) {

      this.data = data;
      this.callback = callback;

   }

}