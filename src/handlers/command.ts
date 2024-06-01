import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest";
import { readdirSync } from "fs";
import { join } from "path";
import { SlashCommand } from "../types";
import { env } from "../env";

const commands = (client: Client) => {
  const slashCommands: SlashCommandBuilder[] = [];

  const slashCommandsDir = join(__dirname, "../slashCommands");

  readdirSync(slashCommandsDir).forEach((file) => {
    if (!file.endsWith(".js")) return;
    const command: SlashCommand =
      // eslint-disable-next-line @typescript-eslint/no-var-requires -- dynamic import
      require(`${slashCommandsDir}/${file}`).default;
    slashCommands.push(command.command);
    client.slashCommands.set(command.command.name, command);
  });

  const rest = new REST({ version: "10" }).setToken(env.CLIENT_TOKEN);

  rest
    .put(Routes.applicationCommands(env.CLIENT_ID), {
      body: slashCommands.map((command) => command.toJSON()),
    })
    .then((data: any) => {
      client.log.info(`🔥 Successfully loaded ${data.length} slash command(s)`);
    })
    .catch((e) => {
      client.log.error(e);
    });
};

export default commands;
