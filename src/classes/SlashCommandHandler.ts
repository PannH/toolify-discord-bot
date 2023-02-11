import { Collection } from 'discord.js';
import { Client, SlashCommand, Logger } from './';
import { readdirSync } from 'fs';

export default class SlashCommandHandler extends Collection<string, SlashCommand> {

   constructor(client: Client) {

      super();

      for (const fileName of readdirSync('./dist/handlers/commands/')) {

         const slashCommand: SlashCommand = require(`../handlers/commands/${fileName}`).default;

         this.set(slashCommand.data.name, slashCommand);

      }

      client.application?.commands.set(
         this.map((slashCommand) => slashCommand.data)
      );

      Logger.info(`Handling ${this.size} slash commands`);

   }

}