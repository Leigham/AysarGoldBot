import { Interaction, SlashCommandBuilder } from 'discord.js';

export type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => void;
  name: string;
};
