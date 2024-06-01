import cron from "node-cron";
import { fetchDictionary } from "./dictionary.scanner.service";
import { insertBlacklistedDomains } from "../repositories/dictionaryBlacklist.repository";
import {
  get1mDomainsCsv,
  parseBufferedCsvToJson,
} from "./domain.whitelist.service";
import { insertWhitelistedDomains } from "../repositories/domainWhitelist.repository";
import client from "../bot";
import { Insertable } from "kysely";
import { DictionaryBlacklist, DomainWhitelist } from "../db/types";
import { Readable } from "stream";

//Daily Cron
const importDictionaryBlacklistJob = cron.schedule(
  "0 0 * * *",
  async () => {
    console.time("Import blacklist");
    const dictionaryResponseStream = await fetchDictionary();

    const bufferObj = Buffer.from(
      dictionaryResponseStream.data.content,
      "base64"
    );

    const stream = Readable.from(bufferObj);

    for await (const chunk of stream) {
      const streamData = JSON.parse(chunk.toString());
      const transformedData: Insertable<DictionaryBlacklist>[] = [];
      for (const domain of streamData) {
        const data: Insertable<DictionaryBlacklist> = {
          domain,
          blacklistImportType: "dictionary",
        };
        transformedData.push(data);
      }

      if (transformedData && transformedData.length > 0)
        await insertBlacklistedDomains(transformedData);
    }
    client.log.info("Successfully inserted blacklisted domains");
    console.timeEnd("Import blacklist");
  },
  {
    scheduled: false,
  }
);

//monthly Cron
const importDomainWhitelistJob = cron.schedule(
  "0 0 1 * *",
  async () => {
    console.time("Import whitelist");
    const dictionaryResponseStream = await get1mDomainsCsv();

    for await (const chunk of dictionaryResponseStream) {
      const parsedJson = await parseBufferedCsvToJson(chunk);

      const transformedData: Insertable<DomainWhitelist>[] = [];
      for (const domain of parsedJson) {
        if (domain.domain && domain.domain !== "") {
          const data: Insertable<DomainWhitelist> = {
            domain: domain.domain,
            whitelistImportType: "api",
          };
          transformedData.push(data);
        }
      }

      if (transformedData && transformedData.length > 0)
        await insertWhitelistedDomains(transformedData);
    }
    client.log.info("Successfully inserted whitelisted domains");
    console.timeEnd("Import whitelist");
  },
  { scheduled: false }
);
export { importDictionaryBlacklistJob, importDomainWhitelistJob };
