import axios from "axios";

/**
 * Fetch the requets
 * @param {string} year
 * @param {string} month
 * @param {string} token
 */
export function fetchRequests(year, month, token) {
  return axios
    .get(
      `https://smapiot-requests.azurewebsites.net/api/requests/${year}/${month}?code=${token}`
    )
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
}
