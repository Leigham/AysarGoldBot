import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../types';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  name: 'ping',
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Pong!');
  },
} as Command;
