import { Insertable } from "kysely";
import { ServerConfig } from "../db/types";
import {
  createNewServerConfig,
  getApiKeyByServerId,
  getServerConfigByServerId,
  updateServerConfigByServerId,
} from "../repositories/serverConfig.repository";
import { decryptKey, encryptKey } from "./encryption.service";

const configureNewServer = (serverConfig: Insertable<ServerConfig>) => {
  return createNewServerConfig(serverConfig);
};

const updateApiKey = (serverId: string, apiKey: string) => {
  const encryptApiKey = encryptKey(apiKey);
  const updateObj = { apiKey: encryptApiKey };
  return updateServerConfigByServerId(serverId, updateObj);
};

const isServerConfigured = (serverId: string) => {
  return getServerConfigByServerId(serverId);
};

const returnDecryptedApiKey = async (serverId: string) => {
  const serverConfig = await getApiKeyByServerId(serverId);
  if (serverConfig?.apiKey) {
    const decryptedApiKey = decryptKey(serverConfig.apiKey);
    return decryptedApiKey;
  }
  return null;
};

const configureServerIfNotExists = async (serverId: string) => {
  const serverConfigResponse = await isServerConfigured(serverId);
  if (!serverConfigResponse?.prefix) {
    await configureNewServer({ serverId });
  }
};
export {
  configureNewServer,
  updateApiKey,
  isServerConfigured,
  returnDecryptedApiKey,
  configureServerIfNotExists,
};
