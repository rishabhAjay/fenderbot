import { Insertable, SqlBool, sql } from "kysely";
import { db } from "../db";
import { DictionaryBlacklist } from "../db/types";

const insertBlacklistedDomains = (
  dictionaryBlacklist: Insertable<DictionaryBlacklist>[]
) => {
  return db
    .insertInto("dictionary_blacklist")
    .values(dictionaryBlacklist)
    .ignore()
    .execute();
};

const returnCountOfMatchedBlacklistDomains = (domain: string) => {
  return db
    .selectFrom("dictionary_blacklist")
    .where(({ eb, and }) =>
      and([
        eb(sql<SqlBool>`lower(${domain})`, "=", sql<SqlBool>` lower(domain)`),
        eb("enabled", "=", 1),
      ])
    )
    .select(sql<number>`COUNT(domain)`.as("count"))
    .execute();
};

export { insertBlacklistedDomains, returnCountOfMatchedBlacklistDomains };
