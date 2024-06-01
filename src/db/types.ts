import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { BlacklistImportType, WhitelistImportType } from "./enums";

export type DictionaryBlacklist = {
    id: Generated<string>;
    domain: string;
    enabled: Generated<number>;
    blacklistImportType: Generated<BlacklistImportType>;
    createdAt: Generated<Timestamp | null>;
    updatedAt: Generated<Timestamp | null>;
};
export type DomainWhitelist = {
    id: Generated<string>;
    domain: string;
    enabled: Generated<number>;
    whitelistImportType: Generated<WhitelistImportType>;
    createdAt: Generated<Timestamp | null>;
    updatedAt: Generated<Timestamp | null>;
};
export type InviteWordsBlacklist = {
    id: Generated<string>;
    word: string;
    enabled: Generated<number>;
    createdAt: Generated<Timestamp | null>;
    updatedAt: Generated<Timestamp | null>;
};
export type ServerConfig = {
    id: Generated<string>;
    serverId: string | null;
    prefix: Generated<string>;
    logChannel: string | null;
    apiKey: string | null;
    createdAt: Generated<Timestamp | null>;
    updatedAt: Generated<Timestamp | null>;
    apiErrorMessage: string | null;
    apiErrorTimestamp: Timestamp | null;
};
export type DB = {
    dictionary_blacklist: DictionaryBlacklist;
    domain_whitelist: DomainWhitelist;
    invite_words_blacklist: InviteWordsBlacklist;
    server_config: ServerConfig;
};
