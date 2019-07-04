import { fetchRequests } from "./requestsService.js";
import {
  isCurrentMonth,
  getDiffInDays,
  getDaysOfCurrentMonth,
  isEndOfMonth
} from "./dateService";

/**
 * Prepare report based on parameters.
 * @param {string} year
 * @param {string} month
 * @param {string} token
 */
export function prepareReport(year, month, token) {
  if (year && month && token) {
    return fetchRequests(year, month, token).then(res => {
      return processData(res);
    });
  }
  return "Invalid input";
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
      requestsPerServiceNames[element.serviceName] = {
        numberOfRequests: 1,
        startDate: new Date(element.requested),
        endDate: new Date(element.requested),
        actualPrice: 0,
        estimatedPriceMonth: 0
      };
    } else {
      requestsPerServiceNames[element.serviceName].numberOfRequests =
        requestsPerServiceNames[element.serviceName].numberOfRequests + 1;

      if (
        new Date(element.requested) <
        requestsPerServiceNames[element.serviceName].startDate
      ) {
        requestsPerServiceNames[element.serviceName].startDate = new Date(
          element.requested
        );
      }

      if (
        new Date(element.requested) >
        requestsPerServiceNames[element.serviceName].endDate
      ) {
        requestsPerServiceNames[element.serviceName].endDate = new Date(
          element.requested
        );
      }
    }
  }

  return {
    startDate: startDate,
    endDate: endDate,
    subscription: "",
    totalNumberOfRequests: totalRequests,
    requestsPerServiceNames: calculateCost(requestsPerServiceNames)
  };
}

function calculateCost(requestsPerServiceNames) {
  for (const key in requestsPerServiceNames) {
    if (requestsPerServiceNames.hasOwnProperty(key)) {
      const element = requestsPerServiceNames[key];
      element.actualPrice = element.numberOfRequests * 2;
      element.estimatedPriceMonth = estimateTheCost(
        element.startDate,
        element.endDate,
        element.actualPrice
      );
    }
  }

  return requestsPerServiceNames;
}

function estimateTheCost(startDate, endDate, actualPrice) {
  if (isCurrentMonth(endDate) && !isEndOfMonth(endDate)) {
    return (
      (getDaysOfCurrentMonth() * actualPrice) /
      getDiffInDays(endDate, startDate)
    );
  }
  return 0;
}
