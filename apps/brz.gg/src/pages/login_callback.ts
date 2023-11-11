import { type APIRoute } from "astro";
import { Auth0Client } from "@/common/oauth/providers/auth0-client";

const oauthClient = new Auth0Client();

export const GET: APIRoute = async ({ redirect, url, cookies }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return new Response(
      JSON.stringify({
        error: "No code provided",
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const token = await oauthClient.getTokenInfo(code);
    const user = await oauthClient.getUserInfo(token.access_token);

    const date = new Date();
    const tokenExpiresAt = date.setSeconds(
      date.getSeconds() + token.expires_in
    );

    cookies.set("authToken", token.access_token);
    cookies.set("authTokenExpiresIn", tokenExpiresAt.toString());
    cookies.set("authTokenType", token.token_type);
    cookies.set("refreshToken", token.refresh_token);
    cookies.set("userInfo", JSON.stringify(user));

    if (state) {
      return redirect(atob(state));
    } else {
      return redirect("/");
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error,
      }),
      {
        status: 400,
      }
    );
  }
};
