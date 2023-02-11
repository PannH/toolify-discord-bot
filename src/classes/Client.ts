import { Client as BaseClient, type ClientOptions } from 'discord.js';
import { EventHandler, SlashCommandHandler } from './';

export default class Client extends BaseClient {

   public events: EventHandler;
   public slashCommands: SlashCommandHandler;

   constructor(options: ClientOptions) {

      super(options);

   }

   public handleEvents(): void {

      this.events = new EventHandler(this);

   }

   public handleSlashCommands(): void {

      this.slashCommands = new SlashCommandHandler(this);

   }

}