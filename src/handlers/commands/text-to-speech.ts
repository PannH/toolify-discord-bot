import { SlashCommand } from '../../classes';
import { codeBlock, ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { getAudioUrl } from 'google-tts-api';
import axios from 'axios';
import Constants from '../../utils/Constants';

export default new SlashCommand({
   name: 'text-to-speech',
   description: 'Convert a text to an audio file.',
   options: [{
      name: 'text',
      description: 'The text you want to convert to audio.',
      type: ApplicationCommandOptionType.String,
      maxLength: 200,
      required: true
   }]
}, async (client, interaction) => {

   const text = interaction.options.getString('text');

   await interaction.deferReply();

   const audioURL = getAudioUrl(text);
   const { data: audioBuffer } = await axios.get(audioURL, {
      responseType: 'arraybuffer'
   });

   const audioAttachment = new AttachmentBuilder(audioBuffer, { name: 'text_to_speech.mp3' });

   const ttsEmbed = new EmbedBuilder()
      .setColor(Constants.EMBED_COLOR)
      .setTitle('Text To Speech')
      .setDescription(
         codeBlock(`Text | ${text}`)
      )

   await interaction.editReply({
      embeds: [ttsEmbed],
      files: [audioAttachment]
   });

});