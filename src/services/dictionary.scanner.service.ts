import axios from "axios";
import { returnCountOfMatchedBlacklistDomains } from "../repositories/dictionaryBlacklist.repository";

const fetchDictionary = async () => {
  return axios.get(
    "https://api.github.com/repos/Discord-AntiScam/scam-links/contents/list.json?ref=main",
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const scanBlacklistForMatches = async (domain: string) => {
  return returnCountOfMatchedBlacklistDomains(domain);
};

export { scanBlacklistForMatches, fetchDictionary };
