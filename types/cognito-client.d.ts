type OAuth2TokenResponse = {
  access_token: string;
  access_token_payload: AccessTokenPayload;
  id_token: string;
  id_token_payload: IdTokenPayload;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

type IdTokenPayload = {
  sub: string;
  email_verified: boolean;
  iss: string;
  origin_jti: string;
  aud: string;
  identities: Record<string, unknown>[];
  token_use: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  email: string;
};

type AccessTokenPayload = {
  sub: string;
  iss: string;
  version: number;
  client_id: string;
  origin_jti: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
};

type Identities = {
  dateCreated: string;
  userId: string;
  providerName: string;
  providerType: string;
}

type CognitoUser = {
  id: number;
  Username?: string;
  UserStatus?: string;
  Enabled?: boolean;
  UserCreateDate: string;
  UserLastModifiedDate: string
  Email: string;
  Email_verified?: boolean;
  Identities: Identities[];
}