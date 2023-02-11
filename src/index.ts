import { Client } from './classes';
import dotenv from 'dotenv';
import { ActivityType } from 'discord.js';

dotenv.config();

const client = new Client({
   intents: ['Guilds'],
   failIfNotExists: false,
   presence: {
      activities: [{
         name: '🛠️',
         type: ActivityType.Playing
      }]
   } 
});

client.login(process.env.CLIENT_TOKEN);

client.handleEvents();