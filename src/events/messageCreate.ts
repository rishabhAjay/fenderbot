import { Message } from "discord.js";
import { BotEvent } from "../types";
import { configureNewServer } from "../services/serverConfig.service";
import { deleteMessage } from "../services/discord.service";
import {
  extractDiscordInvites,
  extractUrlsFromString,
  extractDiscordInviteId,
} from "../utils/functions";

import { REASON } from "../utils/constants";
import { validateDiscordInvites } from "../services/invite.service";
import { scanApiForMatches } from "../services/url.scanner.service";
import { scanBlacklistForMatches } from "../services/dictionary.scanner.service";
import { scanWhitelistForMatches } from "../services/domain.whitelist.service";
import { insertBlacklistedDomains } from "../repositories/dictionaryBlacklist.repository";
import {
  parseUnshortenedUrlResponse,
  unshortenUrl,
} from "../services/unshorten.url.service";

const event: BotEvent = {
  name: "messageCreate",
  execute: async (message: Message) => {
    if (message.client.user.username === message.author.username) return;
    if (message.guildId) {
      const createObj = {
        serverId: message.guildId,
      };
      await configureNewServer(createObj);
    }
    const discordInvites = extractDiscordInvites(message.content);
    if (discordInvites && discordInvites.length > 0) {
      return Promise.all(
        discordInvites?.map((url: string) => {
          const inviteId = extractDiscordInviteId(url);
          if (inviteId) {
            return validateDiscordInvites(message, inviteId);
          }
        })
      );
    }

    const extractedUrlArray = extractUrlsFromString(message.content);
    if (extractedUrlArray && extractedUrlArray.length > 0) {
      return await Promise.all(
        extractedUrlArray.map(async (url: string) => {
          const unshortenedUrlResponse = await unshortenUrl(url);
          let unshortenedUrl = url;
          const parsedUnshortenedUrlRedirectResponse =
            await parseUnshortenedUrlResponse(unshortenedUrlResponse);
          if (parsedUnshortenedUrlRedirectResponse) {
            unshortenedUrl = parsedUnshortenedUrlRedirectResponse;
          }
          const parsedUrl = new URL(unshortenedUrl);
          const parsedDomain = parsedUrl.hostname;
          const matchedWhitelistedLinksCount = await scanWhitelistForMatches(
            parsedDomain
          );

          if (matchedWhitelistedLinksCount[0].count > 0) {
            return;
          }
          const matchedBlacklistedLinksCount = await scanBlacklistForMatches(
            parsedDomain
          );

          if (matchedBlacklistedLinksCount[0].count > 0) {
            return deleteMessage(message, REASON.dictionaryMatchedUrl);
          }
          if (message.guildId) {
            const scanData = await scanApiForMatches(
              unshortenedUrl,
              message.guildId
            );

            if (scanData?.malicious > 0 || scanData?.suspicious > 0) {
              await insertBlacklistedDomains([
                {
                  domain: parsedDomain,
                  blacklistImportType: "api",
                },
              ]);
              return deleteMessage(message, REASON.scannedMaliciousUrl);
            }
          }
        })
      );
    }
  },
};

export default event;
