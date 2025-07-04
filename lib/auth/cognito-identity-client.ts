import * as AWS from "@aws-sdk/client-cognito-identity-provider";
import {
    type InitiateAuthResponse,
    type SignUpResponse,
} from "@aws-sdk/client-cognito-identity-provider";
import { jwtDecode } from "jwt-decode";
import { auth } from "@/auth"
import {
    ConfirmForgotPassword,
    ConfirmRegisteration,
    SignUpCredential,
} from "./cognito-auth-provider";

const REGION = process.env.AWS_COGNITO_REGION!;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;

const USER_POOL_ID = process.env.AWS_COGNITO_USER_POOL_ID!;
const CLIENT_ID = process.env.AWS_COGNITO_CLIENT_ID;
const CLIENT_SECRET = process.env.AWS_COGNITO_CLIENT_SECRET;
const DOMAIN = process.env.AWS_COGNITO_DOMAIN;

const OAUTH_REDIRECT_URL = process.env.OAUTH_REDIRECT_URI;

const client = new AWS.CognitoIdentityProviderClient({
    region: REGION,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
    maxAttempts: 3,
});


export async function signUp({
    email,
    phoneNumber,
    password,
}: SignUpCredential): Promise<SignUpResponse | undefined | null> {
    try {

        const command = new AWS.SignUpCommand({
            ClientId: CLIENT_ID,
            SecretHash: await generateSecretHash(email),
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: "email", Value: email },
                ...(phoneNumber ? [{ Name: "phone_number", Value: phoneNumber }] : []),
            ],
        });
        const response = (await client.send(command)) as SignUpResponse;
        console.log("🚀 ~ signUp ~ response:", response);
        return response;
    } catch (error) {
        console.error("🚀 ~ signUp ~ error:", error);
        return null;
    }
}

export async function confirmSignUp({ email, otpCode }: ConfirmRegisteration) {
    try {
        const command = new AWS.ConfirmSignUpCommand({
            ClientId: CLIENT_ID,
            Username: email,
            ConfirmationCode: otpCode,
            SecretHash: await generateSecretHash(email),
        });
        const response = await client.send(command);
        console.log("🚀 ~ confirmSignUp ~ response:", response);
        return response;
    } catch (error) {
        console.log("🚀 ~ confirmSignUp ~ error:", error);
        return null;
    }
}

export async function resendConfirmationCode(email: string) {
    try {
        const command = new AWS.ResendConfirmationCodeCommand({
            ClientId: CLIENT_ID,
            Username: email,
            SecretHash: await generateSecretHash(email),
        });
        const response = await client.send(command);
        console.log("🚀 ~ resendConfirmationCode ~ response:", response);
    } catch (error) {
        console.log("🚀 ~ resendConfirmationCode ~ error:", error);
    }
}

export async function initiateAuth({
    email,
    password,
}: {
    email: string;
    password: string;
}): Promise<
    | (Pick<InitiateAuthResponse, "AuthenticationResult"> & {
        AccessTokenPayload: AccessTokenPayload;
        IdTokenPayload: IdTokenPayload;
    })
    | undefined | null
> {
    try {
        const command = new AWS.InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: await generateSecretHash(email),
            },
        });
        const response = (await client.send(command)) as InitiateAuthResponse;
        const IdTokenPayload = jwtDecode(response.AuthenticationResult?.IdToken!) as IdTokenPayload;
        const AccessTokenPayload = jwtDecode(
            response.AuthenticationResult?.AccessToken!
        ) as AccessTokenPayload

        return {
            AuthenticationResult: response.AuthenticationResult,
            AccessTokenPayload,
            IdTokenPayload,
        };
    } catch (error) {
        // console.error("🚀 ~ initiateAuth ~ error:", error);
        return null;
    }
}

export async function getOAuth2Token(code: string): Promise<OAuth2TokenResponse | undefined> {
    const authorizationHeader = `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
    ).toString("base64")}`;

    const requestBody = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID as string,
        code: code,
        redirect_uri: OAUTH_REDIRECT_URL as string,
    });

    // Get tokens
    const res = await fetch(`${DOMAIN}/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: authorizationHeader,
        },
        body: requestBody,
    });

    const data = (await res.json()) as OAuth2TokenResponse;

    const id_token_payload = jwtDecode(data.id_token) as IdTokenPayload;
    const access_token_payload = jwtDecode(data.access_token) as AccessTokenPayload;

    return {
        ...data,
        id_token_payload,
        access_token_payload,
    };

}

export async function forgotPassword(email: string) {
    try {
        const command = new AWS.ForgotPasswordCommand({
            ClientId: CLIENT_ID,
            Username: email,
            SecretHash: await generateSecretHash(email),
        });
        const response = await client.send(command);
        console.log("🚀 ~ forgotPassword ~ response:", response);
    } catch (error) {
        console.log("🚀 ~ forgotPassword ~ error:", error);
    }
}

export async function confirmForgotPassword({
    email,
    otpCode,
    newPassword,
}: Pick<ConfirmForgotPassword, 'email' | 'otpCode' | 'newPassword'>) {
    try {
        const command = new AWS.ConfirmForgotPasswordCommand({
            ClientId: CLIENT_ID,
            ConfirmationCode: otpCode,
            Username: email,
            Password: newPassword,
            SecretHash: await generateSecretHash(email),
        });
        const response = await client.send(command);
        console.log("🚀 ~ confirmForgotPassword ~ response:", response);
    } catch (error) {
        console.log("🚀 ~ confirmForgotPassword ~ error:", error);
    }
}

export async function listUsers(): Promise<CognitoUser[] | undefined> {
    try {

        const command = new AWS.ListUsersCommand({
            UserPoolId: USER_POOL_ID,
        });

        const response = await client.send(command);

        let users: CognitoUser[] = [];
        response.Users?.forEach((user, index) => {
            const userIdentities: Identities[] = parseIdentities(user.Attributes || []);
            const cognitoUser: CognitoUser = {
                id: index + 1,
                Username: user.Username,
                UserStatus: user.UserStatus,
                Enabled: user.Enabled,
                Email: user.Attributes?.find(attr => attr.Name === "email")?.Value || "",
                Email_verified: Boolean(user.Attributes?.find(attr => attr.Name === "email_verified")?.Value),
                UserCreateDate: user.UserCreateDate?.toISOString() || "",
                UserLastModifiedDate: user.UserLastModifiedDate?.toISOString() || "",
                Identities: userIdentities,
            }
            users.push(cognitoUser)
        })
        return users;
    } catch (error) {
        console.error("🚀 ~ listUsers ~ error:", error);
    }
}


function parseIdentities(attributes: AWS.AttributeType[]): Identities[] {
    // console.log("🚀 ~ parseIdentities ~ attributes:", attributes)
    const identitiesAttribute = attributes.find(attr => attr.Name === 'identities');
    if (!identitiesAttribute) {
        return [];
    }

    try {
        const identities = JSON.parse(identitiesAttribute.Value!) as Identities[];
        return identities.map(identity => ({
            dateCreated: identity.dateCreated,
            userId: identity.userId,
            providerName: identity.providerName,
            providerType: identity.providerType,
        }));
    } catch (error) {
        console.error('Failed to parse identities:', error);
        return [];
    }
}


export async function getUser() {
    try {
        const session = await auth();
        const command = new AWS.GetUserCommand({
            AccessToken: session?.accessToken,
        });
        const response = await client.send(command);
        console.log("🚀 ~ getUser ~ response:", response);
    } catch (error) {
        console.error("🚀 ~ getUser ~ error:", error);
    }
}

export async function listGroups() {
    try {
        const command = new AWS.ListGroupsCommand({
            UserPoolId: USER_POOL_ID,
            Limit: 20,
        });
        const response = await client.send(command);
        console.log("🚀 ~ listGroups ~ response:", response);
        return response.Groups;
    } catch (error) {
        console.error("🚀 ~ listGroups ~ error:", error);

    }
}

export async function signOut(token: string) {

    try {
        const command = new AWS.GlobalSignOutCommand({
            AccessToken: token,
        });
        const response = await client.send(command);
        console.log("🚀 ~ signOut ~ response:", response);
    } catch (error) {
        console.log("🚀 ~ signOut ~ error:", error);
    }
}

async function generateSecretHash(username: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(CLIENT_SECRET);
    const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const data = encoder.encode(`${username}${CLIENT_ID}`);
    const signature = await crypto.subtle.sign("HMAC", key, data);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

