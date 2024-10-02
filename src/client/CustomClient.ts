import { Client, ClientOptions, Collection, REST, Routes } from 'discord.js';
import { Command } from '../types';
import { promises as fs } from 'fs';
import path from 'path';
import logger from '../services/logger';
import { config as configDotenv } from 'dotenv';
import { DropdownHandler } from '../services/dropdown';
import { DROPDOWN_OPTIONS } from '../constants/dropdown';

// Load environment variables from .env file
configDotenv();

/**
 * CustomClient extends the base Client class from Discord.js.
 * It adds methods for loading commands and events from the filesystem
 * and registering them via the REST API.
 */
export class CustomClient extends Client {
  public commands: Collection<string, Command>;
  public rest: REST;
  public dropdownHandler: DropdownHandler | null | undefined;

  /**
   * Absolute paths to the commands and events directories.
   */
  private readonly COMMANDS_DIR: string;
  private readonly EVENTS_DIR: string;

  /**
   * Constructs a new CustomClient instance.
   * @param {ClientOptions} options - The options for the client.
   */
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();

    // Retrieve the token from environment variables with error handling
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      throw new Error('DISCORD_TOKEN is not defined in environment variables.');
    }

    // Initialize the REST API client
    this.rest = new REST({ version: '10' }).setToken(token);

    // Define the absolute paths to the commands and events directories
    this.COMMANDS_DIR = path.resolve(__dirname, '../commands');
    this.EVENTS_DIR = path.resolve(__dirname, '../events');

    // Log in to Discord and load commands and events
    this.once('ready', () => {
      logger.info(`Logged in as ${this.user?.tag}!`);
      this.loadCommands();
      this.loadEvents();
      this.registerCommands();
      this.dropdownHandler = new DropdownHandler(this, DROPDOWN_OPTIONS);
    });
  }

  /**
   * Registers all commands via the Discord REST API, either globally or for a specific guild.
   *
   * @param {string} [guildId] - Optional guild ID for guild-specific command registration.
   * If no guildId is provided, commands are registered globally.
   * @returns {Promise<void>} - A promise that resolves when registration is complete.
   */
  public async registerCommands(guildId?: string): Promise<void> {
    const commandArray = Array.from(this.commands.values()).map((command) =>
      command.data.toJSON(),
    );

    try {
      if (!this.user) {
        throw new Error(
          'Client user is not defined. Ensure the client is logged in.',
        );
      }

      if (guildId) {
        // Guild-specific registration
        await this.rest.put(
          Routes.applicationGuildCommands(this.user.id, guildId),
          { body: commandArray },
        );
        logger.debug(`Successfully registered commands for guild: ${guildId}`);
      } else {
        // Global registration
        await this.rest.put(Routes.applicationCommands(this.user.id), {
          body: commandArray,
        });
        logger.debug('Successfully registered global commands.');
      }
    } catch (error) {
      logger.error('Error registering commands via REST:', error);
    }
  }

  /**
   * Loads command files from the commands directory recursively.
   * Supports both root and nested command files.
   *
   * @returns {Promise<void>} - A promise that resolves when commands are loaded.
   */
  public async loadCommands(): Promise<void> {
    const commandFiles = await this.getFilesRecursively(this.COMMANDS_DIR);

    for (const file of commandFiles) {
      try {
        const commandModule = await import(file);
        const command: Command = commandModule.default || commandModule;
        if (command?.name) {
          this.commands.set(command.name, command);
          logger.debug(`Loaded command: ${command.name} from ${file}`);
        }
      } catch (error) {
        logger.error(`Failed to load command from file: ${file}`, error);
      }
    }
  }

  /**
   * Loads event files from the events directory recursively.
   * Supports both root and nested event files.
   *
   * @returns {Promise<void>} - A promise that resolves when events are loaded.
   */
  public async loadEvents(): Promise<void> {
    const eventFiles = await this.getFilesRecursively(this.EVENTS_DIR);

    for (const file of eventFiles) {
      try {
        const eventModule = await import(file);
        const event = eventModule.default || eventModule;
        if (event?.name) {
          const handler = (...args: unknown[]): void => event.execute(...args);
          if (event.once) {
            this.once(event.name, handler);
          } else {
            this.on(event.name, handler);
          }
          logger.debug(`Loaded event: ${event.name} from ${file}`);
        }
      } catch (error) {
        logger.error(`Failed to load event from file: ${file}`, error);
      }
    }
  }

  /**
   * Recursively retrieves all `.ts` or `.js` files from a directory.
   *
   * @private
   * @param {string} directory - The directory to search.
   * @returns {Promise<string[]>} - A promise that resolves to an array of file paths.
   */
  private async getFilesRecursively(directory: string): Promise<string[]> {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await this.getFilesRecursively(absolutePath)));
      } else if (absolutePath.endsWith('.ts') || absolutePath.endsWith('.js')) {
        files.push(absolutePath);
      }
    }

    return files;
  }

  /**
   * Logs in to Discord with the bot's token.
   *
   * @returns {Promise<string>} - A promise that resolves to the bot's token.
   */
  public login(): Promise<string> {
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      throw new Error('DISCORD_TOKEN is not defined in environment variables.');
    }
    return super.login(token);
  }
}
