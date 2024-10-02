import { Interaction, SlashCommandBuilder } from 'discord.js';

export type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => void;
  name: string;
};

export type DropdownOption = {
  emoji: string;
  label: string;
  value: string;
};

export type Dropdown = {
  placeholder: string;
  options: DropdownOption[];
};
