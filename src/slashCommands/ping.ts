import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { buildEmbeddedMessage } from "../services/discord.service";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows the bot's ping"),
  execute: (interaction) => {
    interaction.client.log.info("Pong!");
    interaction.reply({
      embeds: [
        buildEmbeddedMessage({
          title: "🏓 Pong!",
          description: `📡 Ping: ${interaction.client.ws.ping}`,
          footerEnabled: true,
        }),
      ],
    });
  },
  cooldown: 10,
};

export default command;
