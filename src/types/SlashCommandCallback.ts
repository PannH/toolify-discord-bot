import { Client } from '../classes';
import { ChatInputCommandInteraction } from 'discord.js';

export type SlashCommandCallback = (client: Client, interaction: ChatInputCommandInteraction) => Promise<any>;