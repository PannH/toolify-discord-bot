import { SlashCommand } from '../../classes';
import { ApplicationCommandOptionType } from 'discord.js';
import { RadioBrowserApi } from 'radio-browser-api';
import { randomUUID } from 'crypto';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection } from '@discordjs/voice';

export default new SlashCommand({
   name: 'radio',
   description: 'Listen to the radio.',
   options: [{
      name: 'connect',
      description: 'Connect the radio to your voice channel.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'search',
         description: 'Search a station by its name.',
         type: ApplicationCommandOptionType.String,
         autocomplete: true,
         required: true
      }]
   }, {
      name: 'disconnect',
      description: 'Disconnect the radio from your voice channel.',
      type: ApplicationCommandOptionType.Subcommand
   }, {
      name: 'change',
      description: 'Change the radio station.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
         name: 'search',
         description: 'Search a station by its name.',
         type: ApplicationCommandOptionType.String,
         autocomplete: true,
         required: true
      }]
   }]
}, async (client, interaction) => {

   const subcommand = interaction.options.getSubcommand();

   await interaction.deferReply()

   switch (subcommand) {

      case 'connect': {

         const clientVoiceChannel = (await interaction.guild.members.fetchMe({
            cache: false
         })).voice.channel;

         if (clientVoiceChannel)
            return interaction.editReply({
               content: `I am already connected to ${clientVoiceChannel}.`
            });

         const memberVoiceChannel = (await interaction.guild.members.fetch({
            user: interaction.user,
            cache: false
         })).voice.channel;

         if (!memberVoiceChannel)
            return interaction.editReply({
               content: 'You must be connected to a voice channel for me to connect to it.'
            });

         const radioBrowserAPI = new RadioBrowserApi(randomUUID(), true);

         const radioStationId = interaction.options.getString('search');
         const radioStation = (await radioBrowserAPI.getStationsById([radioStationId]))[0];

         if (!radioStation)
            return interaction.editReply({
               content: 'Invalid radio station. Please, wait for the autocomplete to prompt you a valid one.'
            })

         const voiceConnection = joinVoiceChannel({
            adapterCreator: interaction.guild.voiceAdapterCreator,
            guildId: interaction.guild.id,
            channelId: memberVoiceChannel.id,
            selfDeaf: true
         });

         const audioPlayer = createAudioPlayer();
         const audioResource = createAudioResource(radioStation.urlResolved);
         
         audioPlayer.play(audioResource);

         voiceConnection.subscribe(audioPlayer);

         await interaction.editReply({
            content: `Connected the radio station **${radioStation.name} (${radioStation.countryCode ? `:flag_${radioStation.countryCode.toLowerCase()}: ` : ''}${radioStation.country}${radioStation.state ? `, ${radioStation.state}` : ''})** to the voice channel ${memberVoiceChannel}.`
         });

         break;

      }

      case 'disconnect': {

         const clientVoiceChannel = (await interaction.guild.members.fetchMe({
            cache: false
         })).voice.channel;

         if (!clientVoiceChannel)
            return interaction.editReply({
               content: 'I am not connected to any voice channel.'
            });

         const memberVoiceChannel = (await interaction.guild.members.fetch({
            user: interaction.user,
            cache: false
         })).voice.channel;

         if (!memberVoiceChannel || !clientVoiceChannel.equals(memberVoiceChannel))
            return interaction.editReply({
               content: 'You must be in the same voice channel as me to disconnect the radio.'
            });

         const voiceConnection = getVoiceConnection(interaction.guild.id);

         voiceConnection.disconnect();
         voiceConnection.destroy();

         await interaction.editReply({
            content: `Disconnected from the voice channel.`
         });

         break;

      }

      case 'change': {

         const clientVoiceChannel = (await interaction.guild.members.fetchMe({
            cache: false
         })).voice.channel;

         if (!clientVoiceChannel)
            return interaction.editReply({
               content: 'I am not connected to any voice channel.'
            });

         const memberVoiceChannel = (await interaction.guild.members.fetch({
            user: interaction.user,
            cache: false
         })).voice.channel;

         if (!memberVoiceChannel || !clientVoiceChannel.equals(memberVoiceChannel))
            return interaction.editReply({
               content: 'You must be in the same voice channel as me to change the radio station.'
            });

         const radioBrowserAPI = new RadioBrowserApi(randomUUID(), true);

         const radioStationId = interaction.options.getString('search');
         const radioStation = (await radioBrowserAPI.getStationsById([radioStationId]))[0];

         if (!radioStation)
            return interaction.editReply({
               content: 'Invalid radio station. Please, wait for the autocomplete to prompt you a valid one.'
            })

         const voiceConnection = getVoiceConnection(interaction.guild.id);

         const audioPlayer = createAudioPlayer();
         const audioResource = createAudioResource(radioStation.urlResolved);
         
         audioPlayer.play(audioResource);

         voiceConnection.subscribe(audioPlayer);

         await interaction.editReply({
            content: `Changed the radio station to **${radioStation.name} (${radioStation.countryCode ? `:flag_${radioStation.countryCode.toLowerCase()}: ` : ''}${radioStation.country}${radioStation.state ? `, ${radioStation.state}` : ''})**.`
         });

         break;

      }

      default:
         break;

   }

});