import { Event, Logger } from '../../classes';

export default new Event('ready', async (client) => {

   Logger.info(`Client is ready as '${client.user.tag}'`);

   client.handleSlashCommands();

}, true);