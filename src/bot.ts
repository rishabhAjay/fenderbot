// FIXME: using this: https://github.com/MericcaN41/discordjs-v14-template-ts/blob/main/src/index.ts
// and https://github.com/fellipeutaka/discord-bot-template/blob/main/src/index.ts

import { Client, Collection, GatewayIntentBits } from "discord.js";
// import { commands } from "./commands";
// import { deployCommands } from "./deploy-commands";
import { env } from "./env";
import { readdirSync } from "fs";
import { join } from "path";
import { SlashCommand } from "./types";
import logger from "./lib/logger";
import events from "./handlers/events";
import commands from "./handlers/command";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.slashCommands = new Collection<string, SlashCommand>();
client.cooldowns = new Collection<string, number>();

client.log = logger;
events(client);
commands(client);

process.on("uncaughtException", (e) => {
  client.log.error(e);
});

client.login(env.CLIENT_TOKEN);
export default client;
