import { BASE_URL } from "@/config";

export const fetchApi = async ({ endpoint = "", options = {} } = {}) => {
   const response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
         ...options.headers,
      },
      ...options,
   });

   const contentType = response.headers.get("content-type");
   const data = contentType?.includes("application/json")
      ? await response.json()
      : null;

   if (!response.ok) {
      throw (
         data?.error ||
         data
         || {
            code: "REQUEST_FAILED",
            message: `Request failed.`,
            status: response.status,
         }
      );
   }

   return data;
};