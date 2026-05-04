import { fetchApi } from "../lib/fetch"

export const checkApi = async () => {
   try {
      return await fetchApi();
   } catch (error) {
      console.error('Error checking API:', error);
      if (!error?.code && !error?.message) {
         error = { code: 'CONNECTION_ERROR', message: 'Could not connect to API.' }
      }
      alert(error.code + '\n' + error.message);
      return error;
   }
}

export const checkSession = async () => {
   try {
      return await fetchApi({ endpoint: "/checksession" });
   } catch (error) {
      console.error("checkSession error:", error);
      return null;
   }
};