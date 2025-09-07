import axios from "axios";
import { getCookie } from "@/lib/cookie";

export const fetcher = async (url: string) => {
  const lang = getCookie("NEXT_LOCALE");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": lang ? lang : "uz",
  };

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
      {
        headers,
      },
    );
    return data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
