type OAuth2TokenResponse = {
  access_token: string;
  access_token_payload: JwtPayload;
  id_token: string;
  id_token_payload: JwtPayload;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};
