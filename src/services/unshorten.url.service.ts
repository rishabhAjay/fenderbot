import axios, { AxiosResponse } from "axios";

const unshortenUrl = (url: string) => {
  return axios.get(
    `https://api.redirect-checker.net/?url=${encodeURIComponent(
      url
    )}&timeout=10&maxhops=10&meta-refresh=1&format=json`
  );
};

const parseUnshortenedUrlResponse = async (
  unshortenedUrlResponse: AxiosResponse
) => {
  if (unshortenedUrlResponse?.data?.result === "success") {
    const unshortenedUrlResult = unshortenedUrlResponse?.data?.data;

    for (const unshortenedUrlFromApi of unshortenedUrlResult) {
      if (
        unshortenedUrlFromApi.response &&
        "redirect_url" in unshortenedUrlFromApi.response.info &&
        unshortenedUrlFromApi.response.info.redirect_url !== ""
      )
        return unshortenedUrlFromApi.response.info.redirect_url;
      else return null;
    }
  }
};

export { parseUnshortenedUrlResponse, unshortenUrl };
