import type { ClientEvents } from 'discord.js';
import type { EventCallback } from '../types';

export default class Event {

   public name: keyof ClientEvents;
   public callback: EventCallback;
   public callOnce: boolean;

   constructor(name: keyof ClientEvents, callback: EventCallback, callOnce: boolean) {

      this.name = name;
      this.callback = callback;
      this.callOnce = callOnce;

   }

}