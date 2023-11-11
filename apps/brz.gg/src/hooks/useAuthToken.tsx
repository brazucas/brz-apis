import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export const useAuthToken = () => {
    const [cookies] = useCookies(['authToken', 'authTokenExpiresIn', 'authTokenType', 'refreshToken']);
    const [authToken, setAuthToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [authTokenExpiresIn, setAuthTokenExpiresIn] = useState(null);
    const [authTokenType, setTokenType] = useState(null);

    useEffect(() => {
        const { authToken, authTokenExpiresIn, authTokenType, refreshToken } = cookies;
        setAuthToken(authToken);
        setRefreshToken(refreshToken);
        setAuthTokenExpiresIn(authTokenExpiresIn);
        setTokenType(authTokenType);
    }, [cookies]);

    return {
        authToken, authTokenExpiresIn, authTokenType, refreshToken
    };
};
