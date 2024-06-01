import { Message } from "discord.js";
import { returnCountOfMatchedWords } from "../repositories/inviteWordsBlacklist.repository";
import { REASON } from "../utils/constants";
import { deleteMessage, returnDiscordInviteMetadata } from "./discord.service";
import { AxiosError } from "axios";
import { removeUnicodeFromString } from "../utils/functions";

const validateDiscordInvites = async (message: Message, inviteId: string) => {
  const inviteMetadataResponse = await returnDiscordInviteMetadata(inviteId);
  if (inviteMetadataResponse && inviteMetadataResponse.data.guild) {
    if (inviteMetadataResponse.data.guild.verification_level <= 0) {
      return deleteMessage(message, REASON.inviteUrlNoVerification);
    }
    const matchedWordsCount = await returnCountOfMatchedWords(
      removeUnicodeFromString(inviteMetadataResponse.data.guild.name)
    );

    if (matchedWordsCount[0].count > 0) {
      return deleteMessage(message, REASON.inviteUrlContainsBlacklistedWord);
    }
  } else if (
    inviteMetadataResponse &&
    inviteMetadataResponse.data.channel &&
    !("guild" in inviteMetadataResponse.data)
  ) {
    const matchedWordsCount = await returnCountOfMatchedWords(
      removeUnicodeFromString(inviteMetadataResponse.data.channel.name)
    );

    if (matchedWordsCount[0].count > 0) {
      return deleteMessage(message, REASON.inviteUrlContainsBlacklistedWord);
    }
  }
};

export { validateDiscordInvites };
