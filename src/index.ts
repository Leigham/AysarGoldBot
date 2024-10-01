import { IntentsBitField } from 'discord.js';
import { CustomClient } from './client/CustomClient';

const client = new CustomClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
});

client.login();
