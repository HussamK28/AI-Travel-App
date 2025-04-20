import React, { useEffect, useState } from "react";
import axios from "axios";
export const GenerateNewToken = async () => {
    const response = await axios.post("https://test.api.amadeus.com/v1/security/oauth2/token", {
      grant_type: "client_credentials",
      client_id: "JiRVF50khDdJNdeZG7Pch75SG70PmGFz",
      client_secret: "H3k65vKUAXZbY2rA",
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  
    return response.data.access_token;
  };
  
  export default GenerateNewToken