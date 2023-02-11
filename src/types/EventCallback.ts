import { Client } from '../classes';

export type EventCallback = (client: Client, ...params: any[]) => Promise<any>;