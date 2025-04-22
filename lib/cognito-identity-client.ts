
import * as AWS from '@aws-sdk/client-cognito-identity-provider';
import { type InitiateAuthResponse, type SignUpResponse } from '@aws-sdk/client-cognito-identity-provider'
import { NodeHttpHandler } from '@smithy/node-http-handler'
import { auth } from '@/auth'
import { createHmac } from 'crypto'
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { ConfirmForgotPassword, ConfirmRegisteration, SignUpCredential } from './cognito-auth-provider';

const REGION = process.env.AWS_COGNITO_REGION!;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;

const USER_POOL_ID = process.env.AWS_COGNITO_USER_POOL_ID!;
const CLIENT_ID = process.env.AWS_COGNITO_CLIENT_ID;
const CLIENT_SECRET = process.env.AWS_COGNITO_CLIENT_SECRET;
const DOMAIN = process.env.AWS_COGNIIO_DOMAIN;

const client = new AWS.CognitoIdentityProviderClient({
    region: REGION,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
    requestHandler: new NodeHttpHandler({
        connectionTimeout: 10000,
        socketTimeout: 10000,
    }),
    maxAttempts: 3
});

export async function signUp({ email, phoneNumber, password }: SignUpCredential): Promise<SignUpResponse | undefined> {
    try {

        const command = new AWS.SignUpCommand({
            ClientId: CLIENT_ID,
            SecretHash: generateSecretHash(email),
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email },
                ...(phoneNumber ? [{ Name: 'phone_number', Value: phoneNumber }] : []),
            ]
        });
        const response = await client.send(command) as SignUpResponse;
        console.log("🚀 ~ signUp ~ response:", response)
        return response;

    } catch (error) {
        console.error("🚀 ~ signUp ~ error:", error);
    }
}

export async function confirmSignUp({ email, otpCode }: ConfirmRegisteration) {
    try {
        const command = new AWS.ConfirmSignUpCommand({
            ClientId: CLIENT_ID,
            Username: email,
            ConfirmationCode: otpCode,
            SecretHash: generateSecretHash(email)
        });
        const response = await client.send(command);
        console.log("🚀 ~ confirmSignUp ~ response:", response)
        return response;
    } catch (error) {
        console.log("🚀 ~ confirmSignUp ~ error:", error)
    }
}

export async function resendConfirmationCode(email: string) {
    try {
        const command = new AWS.ResendConfirmationCodeCommand({
            ClientId: CLIENT_ID,
            Username: email,
            SecretHash: generateSecretHash(email),
        });
        const response = await client.send(command);
        console.log("🚀 ~ resendConfirmationCode ~ response:", response)
    } catch (error) {
        console.log("🚀 ~ resendConfirmationCode ~ error:", error)
    }
}

export async function initiateAuth({ email, password }: { email: string; password: string }): Promise<Pick<InitiateAuthResponse, 'AuthenticationResult'> & { AccessTokenPayload: JwtPayload, IdTokenPayload: JwtPayload } | undefined> {
    try {

        const command = new AWS.InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: generateSecretHash(email)
            },
        });
        const response = await client.send(command) as InitiateAuthResponse
        const IdTokenPayload = jwtDecode(response.AuthenticationResult?.IdToken!);
        const AccessTokenPayload = jwtDecode(response.AuthenticationResult?.AccessToken!);

        return {
            AuthenticationResult: response.AuthenticationResult,
            AccessTokenPayload,
            IdTokenPayload
        }

    } catch (error) {
        console.error("🚀 ~ initiateAuth ~ error:", error);
    }
}

export async function getOAuth2Token(code: string) {

    const authorizationHeader = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
    console.log("🚀 ~ getOAuth2Token ~ authorizationHeader:", authorizationHeader)

    const requestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID as string,
        client_secret_post: CLIENT_SECRET as string,
        code: code,
        redirect_uri: `http://localhost:3000`,
        scope: 'profile+email+openid'
    })
    console.log("🚀 ~ getOAuth2Token ~ requestBody:", requestBody)

    // Get tokens
    const res = await fetch(`${DOMAIN}/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authorizationHeader
        },
        body: requestBody
    })

    const data = await res.json()
    console.log("🚀 ~ getOAuth2Token ~ data:", data)

}


export async function forgotPassword(email: string) {
    try {
        const command = new AWS.ForgotPasswordCommand({
            ClientId: CLIENT_ID,
            Username: email,
            SecretHash: generateSecretHash(email)
        });
        const response = await client.send(command);
        console.log("🚀 ~ forgotPassword ~ response:", response);
    } catch (error) {
        console.log("🚀 ~ forgotPassword ~ error:", error)
    }
}


export async function confirmForgotPassword({ email, otpCode, newPassword }: ConfirmForgotPassword) {
    try {
        const command = new AWS.ConfirmForgotPasswordCommand({
            ClientId: CLIENT_ID,
            ConfirmationCode: otpCode,
            Username: email,
            Password: newPassword,
            SecretHash: generateSecretHash(email)
        });
        const response = await client.send(command);
        console.log("🚀 ~ confirmForgotPassword ~ response:", response);
    } catch (error) {
        console.log("🚀 ~ confirmForgotPassword ~ error:", error)
    }
}

export async function listUsers() {
    try {
        const command = new AWS.ListUsersCommand({
            UserPoolId: USER_POOL_ID,
        });
        const response = await client.send(command);
        console.log("🚀 ~ listUsers ~ response:", response);
    } catch (error) {
        console.error("🚀 ~ listUsers ~ error:", error);
    }
}


export async function getUser() {
    try {
        const session = await auth();
        const command = new AWS.GetUserCommand({
            AccessToken: session?.accessToken
        });
        const response = await client.send(command);
        console.log("🚀 ~ getUser ~ response:", response);
    } catch (error) {
        console.error("🚀 ~ getUser ~ error:", error);
    }
}

export async function signOut(token: string) {
    const session = await auth();

    try {
        const command = new AWS.GlobalSignOutCommand({
            AccessToken: session?.accessToken
        })
        const response = await client.send(command);
        console.log("🚀 ~ signOut ~ response:", response)
    } catch (error) {
        console.log("🚀 ~ signOut ~ error:", error)

    }
}

function generateSecretHash(username: string) {

    const hasher = createHmac('sha256', CLIENT_SECRET!);
    hasher.update(`${username}${CLIENT_ID}`);
    const secretHash = hasher.digest('base64');

    return secretHash;

}