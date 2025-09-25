import axios from "axios";
import Cookies from "js-cookie";

export const fetcher = async (url: string) => {
  const locale = Cookies.get("NEXT_LOCALE") || "uz";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": locale,
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
