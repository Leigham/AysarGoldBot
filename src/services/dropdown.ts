// DropdownHandler.ts

import {
  Client,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Interaction,
  TextChannel,
  StringSelectMenuInteraction,
  StringSelectMenuOptionBuilder,
  Events,
} from 'discord.js';

import { Dropdown } from '../types';

/**
 * Class to generate and handle dropdown menus
 */
export class DropdownHandler {
  private client: Client;
  private dropdownOptions: Dropdown[];
  private customId: string;

  /**
   * @param client - The Discord client
   * @param dropdownOptions - The dropdown options
   */
  constructor(client: Client, dropdownOptions: Dropdown[]) {
    this.client = client;
    this.dropdownOptions = dropdownOptions;
    this.customId = 'fruit_select'; // Unique identifier for the dropdown
    this.client.on(Events.InteractionCreate, this.handleInteraction.bind(this));
  }

  /**
   * Generates and sends the dropdown menu to a specified channel
   * @param channel - The channel to send the dropdown to
   */
  public async sendDropdown(channel: TextChannel): Promise<void> {
    const dropdown = this.dropdownOptions[0]; // Assuming a single dropdown for simplicity

    // Map your options to the format required by StringSelectMenuBuilder
    const selectOptions = dropdown.options.map((option) =>
      new StringSelectMenuOptionBuilder()
        .setLabel(option.label)
        .setValue(option.value)
        .setEmoji(option.emoji),
    );

    // Create the select menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(this.customId)
      .setPlaceholder(dropdown.placeholder)
      .addOptions(selectOptions);

    // Create an action row and add the select menu to it
    const actionRow =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    // Send the message with the dropdown menu
    await channel.send({
      content: 'Please select a fruit:',
      components: [actionRow],
    });
  }

  /**
   * Handles interactions when a user selects an option from the dropdown
   * @param interaction - The interaction object
   */
  private async handleInteraction(interaction: Interaction): Promise<void> {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== this.customId) return;

    const selectedValue = interaction.values[0];

    // Find the selected option from your DROPDOWN_OPTIONS
    const selectedOption = this.dropdownOptions[0].options.find(
      (option) => option.value === selectedValue,
    );

    if (!selectedOption) {
      await interaction.reply({
        content: 'Invalid selection.',
        ephemeral: true,
      });
      return;
    }

    // Check if the selected option is 'grape' to execute custom logic
    if (selectedOption.value === 'grape') {
      await this.handleGrapeSelect(interaction);
    } else {
      // Default response for other options
      await interaction.reply({
        content: `You selected: **${selectedOption.label}**`,
        ephemeral: true,
      });
    }
  }

  /**
   * Custom handler for when 'Grape' is selected
   * @param interaction - The interaction object
   */
  private async handleGrapeSelect(
    interaction: StringSelectMenuInteraction,
  ): Promise<void> {
    // Your custom logic for 'Grape' selection
    await interaction.reply({
      content: 'You selected **Grape**! Special action executed.',
      ephemeral: true,
    });
    // Additional logic can be implemented here
  }
}
