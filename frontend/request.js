const axios = require("axios");

// URL and data from your example
const url = "http://127.0.0.1:8000/api/login/";
const data = {
  email: "a@a.com",
  password: "a",
};

// Perform the Axios POST request
axios
  .post(url, data, { headers: { "Content-Type": "application/json" } })
  .then((response) => {
    console.log("Response data:", response.data);
  })
  .catch((error) => {
    if (error.response) {
      // The request was made, and the server responded with a status code outside 2xx range
      console.error("Error status:", error.response.status);
      console.error("Error response data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something else happened while setting up the request
      console.error("Error:", error.message);
    }
  });
