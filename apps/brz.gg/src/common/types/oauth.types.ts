export type OAuthToken = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
};

export type OAuthUserInfo = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  middle_name: string;
  nickname: string;
  preferred_username: string;
  profile: string;
  picture: string;
  website: string;
  email: string;
  email_verified: boolean;
  gender: string;
  birthdate: string;
  zoneinfo: string;
  locale: string;
  phone_number: string;
  phone_number_verified: boolean;
  address: {
    country: string;
  };
  updated_at: string;
};
