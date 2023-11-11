import type { OAuthToken, OAuthUserInfo } from "./types/oauth.types";

export class OAuthClient {
  private domain: string;
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(
    domain: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ) {
    this.domain = domain;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  getUserInfo = async (accessToken: string): Promise<OAuthUserInfo> => {
    const request = await fetch(`https://${this.domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (request.status !== 200) {
      throw new Error("Error fetching auth token");
    }

    return await request.json();
  };

  getTokenInfo = async (code: string): Promise<OAuthToken> => {
    const formData = new URLSearchParams();
    formData.append("grant_type", "authorization_code");
    formData.append("client_id", this.clientId);
    formData.append("client_secret", this.clientSecret);
    formData.append("code", code);
    formData.append("redirect_uri", this.redirectUri);

    const request = await fetch(`https://${this.domain}/oauth/token`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (request.status !== 200) {
      throw new Error("Error fetching auth token");
    }

    return await request.json();
  };
}
