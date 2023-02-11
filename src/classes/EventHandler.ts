import { Collection, type ClientEvents } from 'discord.js';
import { Client, Event, Logger } from './';
import { readdirSync } from 'fs';

export default class EventHandler extends Collection<keyof ClientEvents, Event> {

   constructor(client: Client) {

      super();

      for (const fileName of readdirSync('./dist/handlers/events/')) {

         const event: Event = require(`../handlers/events/${fileName}`).default;
         const callbackBind = event.callback.bind(null, client);

         if (event.callOnce)
            client.once(event.name, callbackBind);
         else
            client.on(event.name, callbackBind);

         this.set(event.name, event);

      }

      Logger.info(`Handling ${this.size} events`);

   }

}