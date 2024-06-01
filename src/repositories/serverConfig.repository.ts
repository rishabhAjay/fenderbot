import { Insertable, Updateable } from "kysely";
import { db } from "../db";
import { ServerConfig } from "../db/types";

const getApiKeyByServerId = (serverId: string) => {
  return db
    .selectFrom("server_config")
    .where("serverId", "=", serverId)
    .select("apiKey")
    .executeTakeFirst();
};

const getServerConfigByServerId = (serverId: string) => {
  return db
    .selectFrom("server_config")
    .where("serverId", "=", serverId)
    .select(["prefix", "logChannel"])
    .executeTakeFirst();
};

const createNewServerConfig = (serverConfig: Insertable<ServerConfig>) => {
  return db
    .insertInto("server_config")
    .values(serverConfig)
    .ignore()
    .executeTakeFirstOrThrow();
};

const updateServerConfigByServerId = (
  serverId: string,
  updateWith: Updateable<ServerConfig>
) => {
  return db
    .updateTable("server_config")
    .set(updateWith)
    .where("serverId", "=", serverId)
    .execute();
};

export {
  updateServerConfigByServerId,
  createNewServerConfig,
  getServerConfigByServerId,
  getApiKeyByServerId,
};
