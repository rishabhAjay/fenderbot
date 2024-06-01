import extractUrls from "extract-urls";

const extractUrlsFromString = (text: string) => {
  const extractedUrls = extractUrls(text);
  if (extractedUrls && extractedUrls.length > 0) {
    return extractedUrls.filter((url: string) => !url.includes("discord.gg"));
  }
  return [];
};

const extractDiscordInvites = (content: string) => {
  // Define the regex pattern
  const regex =
    /(https?:\/\/|http?:\/\/)?(www.)?(discord.gg|discord.io|discord.me|discord.li|discordapp.com\/invite|discord.com\/invite)\/[^\s/]+?(?=\b)/g;

  // Use the RegExp to search for matches in the message
  const matches = content.match(regex);

  // Return an array of matches
  return matches;
};

const extractDiscordInviteId = (url: string) => {
  const parsedUrlArray = url.split("/");
  const parsedUrl = parsedUrlArray[parsedUrlArray.length - 1];
  if (parsedUrl) return parsedUrl.replace("/", "").trim();

  return null;
};

const removeUnicodeFromString = (text: string) => {
  // eslint-disable-next-line no-control-regex
  return decodeURI(text).replace(/[^\x00-\x7F]/g, "");
};
export {
  extractUrlsFromString,
  extractDiscordInvites,
  extractDiscordInviteId,
  removeUnicodeFromString,
};
