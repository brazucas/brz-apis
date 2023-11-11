import { OAuthClient } from "@/common/oauth-client";

export class Auth0Client extends OAuthClient {
  constructor() {
    super(
      import.meta.env.PUBLIC_AUTH0_DOMAIN,
      import.meta.env.PUBLIC_AUTH0_CLIENT_ID,
      import.meta.env.AUTH0_SECRET,
      import.meta.env.PUBLIC_AUTH0_LOGOUT_URI
    );
  }
}
