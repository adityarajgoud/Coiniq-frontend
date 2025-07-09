// src/utils/handleAxiosError.js
import { toast } from "react-toastify";

/**
 * Handle all Axios errors gracefully and show meaningful toast notifications.
 * @param {object} error - The Axios error object.
 * @param {string} context - Custom message for which API call failed.
 */
export const handleAxiosError = (error, context = "Something went wrong") => {
  if (error.response) {
    // Server responded with a status other than 2xx
    if (error.response.status === 429) {
      toast.error(`${context}: API Rate Limit Exceeded (429) 🚫`);
    } else if (error.response.status >= 500) {
      toast.error(`${context}: Server Error (${error.response.status}) 💥`);
    } else {
      toast.error(
        `${context}: ${error.response.status} ${error.response.statusText}`
      );
    }
  } else if (error.request) {
    // Request was made but no response
    toast.error(`${context}: No response from server ❌`);
  } else {
    // Something else caused the error
    toast.error(`${context}: ${error.message}`);
  }

  console.error("Axios Error:", error);
};
