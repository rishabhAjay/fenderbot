import {
  ColorResolvable,
  EmbedBuilder,
  Message,
  MessageCreateOptions,
  MessagePayload,
} from "discord.js";
import { getServerConfigByServerId } from "../repositories/serverConfig.repository";
import client from "../bot";
import axios from "axios";
import dayjs from "dayjs";
import { env } from "../env";
type IReason = { text: string; color: ColorResolvable };

const deleteMessage = async (msg: Message, reason: IReason) => {
  await msg.delete();
  await postLog(msg, reason);
  return msg.channel.send(`${msg.author} has posted a suspicious link.`);
};

const sendMessageToSameChannel = (
  msg: Message,
  content: string | MessagePayload | MessageCreateOptions
) => {
  return msg.channel.send(content);
};

const sendMessageToDifferentChannel = async (
  channelId: string,
  content: string | MessagePayload | MessageCreateOptions
) => {
  const getChannel = await client.channels.fetch(channelId);

  if (getChannel?.type === 0) return getChannel?.send(content);
};
const postLog = async (msg: Message, reason: IReason) => {
  if (msg.guildId) {
    const serverId = msg.guildId;
    const serverConfig = await getServerConfigByServerId(serverId);
    if (!serverConfig?.logChannel) return;
    const title = `${env.BOT_NAME} removed a link`;
    const description = `Posted by ${msg.author} in channel ${msg.channel}`;
    const field = {
      name: `Reason: ${reason.text}`,
      value: `contents: ${msg.content}`,
    };
    await sendMessageToDifferentChannel(serverConfig.logChannel, {
      embeds: [
        buildEmbeddedMessage({
          title,
          description,
          fields: [field],
          color: reason.color,
          timestamp: msg.createdTimestamp,
        }),
      ],
    });
  }
};

const sendMessageToDifferentServer = async (
  serverId: string,
  channelId: string,
  content: string | MessagePayload | MessageCreateOptions
) => {
  const getServerAndChannel = await (
    await client.guilds.fetch(serverId)
  ).channels.fetch(channelId);

  if (getServerAndChannel?.type === 0)
    return getServerAndChannel?.send(content);
};

const buildEmbeddedMessage = ({
  title,
  description,
  fields,
  color,
  timestamp,
  footerEnabled,
}: {
  title: string;
  description: string;
  fields?: Array<{ name: string; value: string }>;
  color?: ColorResolvable;
  timestamp?: number;
  footerEnabled?: boolean;
}) => {
  if (!color) color = "#1492db";
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(footerEnabled ? title + "(Link to our support server)" : title)
    .setAuthor({
      name: `${env.BOT_NAME}`,
      iconURL: `${client.user?.avatarURL()}`,
    })
    .setDescription(description);
  if (timestamp) {
    embed.setFooter({
      text: `timestamp: ${dayjs(timestamp).format("YYYY-MM-DD HH:mm")}`,
    });
  }
  if (fields && fields.length > 0) {
    embed.addFields([...fields]);
  }
  if (footerEnabled) embed.setURL(env.SERVER_INVITE_LINK);
  return embed;
};

const returnDiscordInviteMetadata = (inviteId: string) => {
  return axios.get(`https://discordapp.com/api/v9/invites/${inviteId}`);
};

export {
  deleteMessage,
  postLog,
  returnDiscordInviteMetadata,
  buildEmbeddedMessage,
  sendMessageToSameChannel,
  sendMessageToDifferentServer,
};
