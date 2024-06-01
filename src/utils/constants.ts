import { ColorResolvable } from "discord.js";

export const algorithm = "aes-256-cbc";

type IReasonConstant = {
  [key: string]: { text: string; color: ColorResolvable };
};
export const REASON: IReasonConstant = {
  inviteUrlContainsBlacklistedWord: {
    text: "The Invite URL contained a blacklisted word",
    color: "#990c0c",
  },
  inviteUrlNoVerification: {
    text: "The invite URL's server has 0 Verification Level",
    color: "#eb7434",
  },
  scannedMaliciousUrl: {
    text: "The URL scanned was found to be malicious",
    color: "#996c0c",
  },
  dictionaryMatchedUrl: {
    text: "The URL was found in the dictionary list",
    color: "#6e2407",
  },
};
