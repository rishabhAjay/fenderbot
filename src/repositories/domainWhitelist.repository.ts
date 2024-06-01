import { Insertable, SqlBool, sql } from "kysely";
import { db } from "../db";
import { DomainWhitelist } from "../db/types";

const insertWhitelistedDomains = (
  domainWhitelist: Insertable<DomainWhitelist>[]
) => {
  return db
    .insertInto("domain_whitelist")
    .values(domainWhitelist)
    .ignore()
    .execute();
};

const returnCountOfMatchedWhitelistDomains = (domain: string) => {
  return db
    .selectFrom("domain_whitelist")
    .where(({ eb, and }) =>
      and([
        eb(sql<SqlBool>`lower(${domain})`, "=", sql<SqlBool>` lower(domain)`),
        eb("enabled", "=", 1),
      ])
    )
    .select(sql<number>`COUNT(domain)`.as("count"))
    .execute();
};

export { insertWhitelistedDomains, returnCountOfMatchedWhitelistDomains };
