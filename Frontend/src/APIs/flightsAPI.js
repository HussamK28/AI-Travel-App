import React, { useEffect, useState } from "react";
import axios from "axios";
export const GenerateNewToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", "JiRVF50khDdJNdeZG7Pch75SG70PmGFz");
  params.append("client_secret", "H3k65vKUAXZbY2rA");

  const response = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    params,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );

  return response.data.access_token;
};

export default GenerateNewToken;
