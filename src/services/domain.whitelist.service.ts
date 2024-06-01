import axios from "axios";
import { returnCountOfMatchedWhitelistDomains } from "../repositories/domainWhitelist.repository";
import { csv2json } from "json-2-csv";

const scanWhitelistForMatches = (domain: string) => {
  return returnCountOfMatchedWhitelistDomains(domain);
};

const get1mDomainsCsv = async () => {
  const options = {
    method: "GET",
    headers: {},
    url: "https://tranco-list.eu/api/lists/date/latest?subdomains=true",
  };

  const hello = await axios(options);
  if (hello.status === 200) {
    const hello2 = await axios.get(hello.data.download, {
      responseType: "stream",
    });
    return hello2.data;
  }
};

const parseBufferedCsvToJson = async (chunk: Buffer) => {
  return csv2json(chunk.toString(), {
    delimiter: { eol: "\r" },
    headerFields: ["", "domain"],
  }) as Array<{ domain: string }>;
};

export { scanWhitelistForMatches, get1mDomainsCsv, parseBufferedCsvToJson };
