import { useEffect, useState } from "react";
export function GenerateNewToken() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/viewFlightsAPIToken/");
                const data = await response.json();
                if (data.access_token) {
                    setToken(data.access_token);
                }
            } catch (error) {
                console.error("Error fetching token:", error);
            }
        };

        fetchToken();
    }, []);

    return token;
}