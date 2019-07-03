const axios = require("axios");

function prepareReport(year, month, token) {
  if (year && month && token) {
    return fetchRequests(year, month, token).then(res => {
      return processData(res);
    });
  }
  return "Invalid input";
}

function fetchRequests(year, month, token) {
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

function processData(res) {
  const totalRequests = res.data.requests.length;
  const requestsPerServiceNames = {};
  let startDate, endDate;

  for (let index = 0; index < res.data.requests.length; index++) {
    const element = res.data.requests[index];

    if (new Date(element.requested) > endDate || !endDate) {
      endDate = new Date(element.requested);
    }

    if (new Date(element.requested) < startDate || !startDate) {
      startDate = new Date(element.requested);
    }

    if (!requestsPerServiceNames[element.serviceName]) {
      requestsPerServiceNames[element.serviceName] = 1;
    } else {
      requestsPerServiceNames[element.serviceName] =
        requestsPerServiceNames[element.serviceName] + 1;
    }
  }

  return {
    startDate: startDate,
    endDate: endDate,
    subscription: "",
    totalNumberOfRequests: totalRequests,
    requestsPerServiceNames: requestsPerServiceNames
  };
}

module.exports = prepareReport;
