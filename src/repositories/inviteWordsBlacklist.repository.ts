import { Insertable, SqlBool, sql } from "kysely";
import { db } from "../db";
import { InviteWordsBlacklist } from "../db/types";

const returnAllBlacklistedWords = () => {
  return db
    .selectFrom("invite_words_blacklist")
    .where("enabled", "=", 1)
    .select("word")
    .execute();
};

const createBlacklistedWord = (
  inviteWordsBlacklist: Insertable<InviteWordsBlacklist>[]
) => {
  return db
    .insertInto("invite_words_blacklist")
    .values(inviteWordsBlacklist)
    .ignore()
    .executeTakeFirstOrThrow();
};

const returnCountOfMatchedWords = (word: string) => {
  return db
    .selectFrom("invite_words_blacklist")
    .where(({ eb, and }) =>
      and([
        eb(
          sql<SqlBool>`lower(${word})`,
          "like",
          sql<SqlBool>` concat('%', word, '%')`
        ),
        eb("enabled", "=", 1),
      ])
    )
    .select(sql<number>`COUNT(word)`.as("count"))
    .execute();
};

export {
  returnAllBlacklistedWords,
  createBlacklistedWord,
  returnCountOfMatchedWords,
};
