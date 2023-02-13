import { Client } from '../classes';
import type { AutocompleteInteraction } from 'discord.js';

export type AutocompleteCallback = (client: Client, interaction: AutocompleteInteraction) => Promise<any>;