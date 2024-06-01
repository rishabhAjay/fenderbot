import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import {
  buildEmbeddedMessage,
  returnDiscordInviteMetadata,
  sendMessageToDifferentServer,
} from "../services/discord.service";
import {
  extractDiscordInviteId,
  extractDiscordInvites,
} from "../utils/functions";
import { env } from "../env";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("report-server-invite")
    .setDescription("Allows user to report a false server invite")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("A valid invite link to the discord server")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction) => {
    await interaction.deferReply();
    const discordInvites = extractDiscordInvites(
      interaction.options.data[0].value as string
    );
    if (discordInvites && discordInvites.length > 0) {
      await Promise.all(
        discordInvites?.map(async (url: string) => {
          const inviteId = extractDiscordInviteId(url);

          if (inviteId) {
            const inviteMetadataResponse = await returnDiscordInviteMetadata(
              inviteId
            );
            if (inviteMetadataResponse && inviteMetadataResponse.data.guild) {
              const guildObject = inviteMetadataResponse.data.guild;
              await sendMessageToDifferentServer(
                env.SUPPORT_SERVER_ID,
                env.SUPPORT_SERVER_REPORT_CHANNEL_ID,
                {
                  embeds: [
                    buildEmbeddedMessage({
                      title: `Reported by server: ${interaction.guild}`,
                      description: `${url}`,
                      fields: [
                        {
                          name: "Invite Server Name",
                          value: `${guildObject.name}`,
                        },
                        {
                          name: "Invite Server Verification Level",
                          value: `${guildObject.verification_level}`,
                        },
                      ],
                      timestamp: interaction.createdTimestamp,
                    }),
                  ],
                }
              );
              await interaction.editReply({
                embeds: [
                  buildEmbeddedMessage({
                    title: "Your reported invite link has been submitted",
                    description: `We will review it shortly`,
                  }),
                ],
              });
            } else if (
              inviteMetadataResponse &&
              inviteMetadataResponse.data.channel &&
              !("guild" in inviteMetadataResponse.data)
            ) {
              const groupObject = inviteMetadataResponse.data.channel;
              await sendMessageToDifferentServer(
                env.SUPPORT_SERVER_ID,
                env.SUPPORT_SERVER_REPORT_CHANNEL_ID,
                {
                  embeds: [
                    buildEmbeddedMessage({
                      title: `Reported by server: ${interaction.guild}`,
                      description: `${url}`,
                      fields: [
                        {
                          name: "Invite Group Name",
                          value: `${groupObject.name}`,
                        },
                      ],
                      timestamp: interaction.createdTimestamp,
                    }),
                  ],
                }
              );
              await interaction.editReply({
                embeds: [
                  buildEmbeddedMessage({
                    title: "Your reported invite link has been submitted",
                    description: `We will review it shortly`,
                  }),
                ],
              });
            } else {
              await interaction.editReply({
                embeds: [
                  buildEmbeddedMessage({
                    title: "Failed to report the invite",
                    description: `Reason: The link may not be a server invite`,
                  }),
                ],
              });
            }
          } else {
            await interaction.editReply({
              embeds: [
                buildEmbeddedMessage({
                  title: "Failed to report the invite",
                  description: `Reason: The link may not be a valid discord invite link`,
                }),
              ],
            });
          }
        })
      );
    } else {
      await interaction.editReply({
        embeds: [
          buildEmbeddedMessage({
            title: "Failed to report the invite",
            description: `Reason: The link may not be a valid discord invite link`,
          }),
        ],
      });
    }
  },
  cooldown: 10,
};

export default command;
