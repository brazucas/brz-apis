import { useEffect, useState } from "react";
import { useAuthToken } from "./useAuthToken";
import { useCookies } from "react-cookie";
import type { OAuthUserInfo } from "@/common/types/oauth.types";

type UserInfo = {
    nickname: string;
    name: string;
    email: string;
    picture: string;
    email_verified: string;
}

export const useUser = () => {
    const [cookies, setCookie] = useCookies(['userInfo']);

    const { authToken, authTokenExpiresIn } = useAuthToken();
    const [ isUserAuthenticated, setIsAuthenticated ] = useState(false);
    const [ userInfo, setUserInfo ] = useState<UserInfo | null>(null);

    const storeUserInfo = (userInfo: OAuthUserInfo) => setCookie('userInfo', userInfo);

    useEffect(() => {
        setIsAuthenticated(!!authToken);
    }, [authToken, authTokenExpiresIn]);

    useEffect(() => {
        const { userInfo } = cookies;

        if (userInfo) {
            setUserInfo(userInfo);
        }
    }, [cookies]);

    return {
        isUserAuthenticated, userInfo, storeUserInfo,
    };
};
