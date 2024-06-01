import axios, { AxiosError } from "axios";
import { returnDecryptedApiKey } from "./serverConfig.service";
import { updateServerConfigByServerId } from "../repositories/serverConfig.repository";
import dayjs from "dayjs";
import client from "../bot";

const getScanUrlApi = (url: string, apiKey: string) => {
  const options = {
    method: "GET",
    headers: { accept: "application/json", "x-apikey": apiKey },
  };

  return axios(
    `https://www.virustotal.com/api/v3/search?query=${url}`,
    options
  );
};

const callScanUrlApi = async (url: string, serverId: string) => {
  const decryptedApiKey = await returnDecryptedApiKey(serverId);
  if (decryptedApiKey) return getScanUrlApi(url, decryptedApiKey);
};

const scanApiForMatches = async (url: string, serverId: string) => {
  try {
    const scannedUrlResponse = await callScanUrlApi(url, serverId);

    const lastAnalysisStats =
      scannedUrlResponse?.data.data[0].attributes.last_analysis_stats;

    return {
      malicious: lastAnalysisStats.malicious || 0,
      suspicious: lastAnalysisStats.suspicious || 0,
    };
  } catch (error) {
    if (error instanceof AxiosError)
      await updateServerConfigByServerId(serverId, {
        apiErrorMessage: error?.response?.data.error.message,
        apiErrorTimestamp: dayjs().toDate(),
      });
    else client.log.error(error);
  }
};

export { callScanUrlApi, scanApiForMatches, getScanUrlApi };
