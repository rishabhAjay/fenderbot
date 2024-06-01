import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { SlashCommand } from "../types";
import {
  configureServerIfNotExists,
  updateApiKey,
} from "../services/serverConfig.service";
import { getScanUrlApi } from "../services/url.scanner.service";
import { buildEmbeddedMessage } from "../services/discord.service";
import { AxiosError } from "axios";
import { env } from "../env";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("configure-api-key")
    .setDescription("Allows user to update Virustotal API Key")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("A valid API key")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    if (interaction.user.globalName !== env.SUPER_ADMIN) {
      return interaction.reply({
        embeds: [
          buildEmbeddedMessage({
            title: "This feature is currently in Beta",
            description: `Please contact the support server for more information.`,
            footerEnabled: true,
          }),
        ],
      });
    }
    await interaction.deferReply();
    const serverId = interaction?.guildId;
    if (serverId) {
      await configureServerIfNotExists(serverId);
      const apiKey = interaction.options.data[0].value as string;
      try {
        const validateApiKey = await getScanUrlApi(
          "https://google.com",
          apiKey
        );
        if (validateApiKey.status === 200) {
          await updateApiKey(serverId, apiKey);
          await interaction.editReply({
            embeds: [
              buildEmbeddedMessage({
                title: "API key has been set successfully!",
                description:
                  "Virustotal API adds an extra layer of security on the links posted here.",
              }),
            ],
          });
        }
      } catch (error: any) {
        if (error instanceof AxiosError)
          await interaction.editReply({
            embeds: [
              buildEmbeddedMessage({
                title: "Failed to set the API key",
                description: `Reason: ${error?.response?.data.error.message}`,
              }),
            ],
          });
        else
          await interaction.editReply({
            embeds: [
              buildEmbeddedMessage({
                title: "Failed to set the API key",
                description: `Reason: ${error?.message}`,
              }),
            ],
          });
      }
    }
  },
  cooldown: 60,
};

export default command;
