export const BlacklistImportType = {
    api: "api",
    dictionary: "dictionary"
} as const;
export type BlacklistImportType = (typeof BlacklistImportType)[keyof typeof BlacklistImportType];
export const WhitelistImportType = {
    manual: "manual",
    api: "api"
} as const;
export type WhitelistImportType = (typeof WhitelistImportType)[keyof typeof WhitelistImportType];
