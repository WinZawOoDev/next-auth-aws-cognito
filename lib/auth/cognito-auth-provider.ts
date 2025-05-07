import { CognitoUser, CognitoUserAttribute, CognitoUserPool, AuthenticationDetails, ISignUpResult, CognitoUserSession, IAuthenticationCallback } from 'amazon-cognito-identity-js';

export type SignUpCredential = {
    email: string;
    phoneNumber?: string
    password: string;
}

export type ConfirmRegisteration = Pick<SignUpCredential, 'email'> & { otpCode: string };

type SignIn = Omit<SignUpCredential, 'phoneNumber'> & IAuthenticationCallback

type ForgotPassword = Pick<SignUpCredential, 'email'> & { onSuccess: (data: any) => void; onFailure: (error: Error) => void; inputVerificationCode: (data: any) => void; }

export type ConfirmForgotPassword = Pick<SignUpCredential, 'email'> & { otpCode: string; newPassword: string; onSuccess: (success: string) => void; onFailure: (error: Error) => void; }

// const UserPoolId = process.env.AWS_COGNITO_USER_POOL_ID || '';
// const ClientId = process.env.AWS_COGNITO_CLIENT_ID || '';


// const userPool = new CognitoUserPool({ UserPoolId, ClientId });
// const cognitoUser = (email: string) => new CognitoUser({ Username: email, Pool: userPool });


// export function signUp({ email, phoneNumber, password }: SignUpCredential): Promise<ISignUpResult | undefined> {

//     const attributeList: CognitoUserAttribute[] = [];

//     const attributeEmail = new CognitoUserAttribute({
//         Name: "email",
//         Value: email,
//     })

//     attributeList.push(attributeEmail);

//     if (phoneNumber) {
//         const attributePhoneNumber = new CognitoUserAttribute({
//             Name: "phone_number",
//             Value: "+959123456789",
//         })
//         attributeList.push(attributePhoneNumber);
//     }

//     return new Promise((resolve, reject) => {
//         userPool.signUp(
//             email,
//             password,
//             attributeList,
//             attributeList,
//             (err, result) => {
//                 if (err) {
//                     console.log("🚀 ~ signUp ~ err:", err);
//                     reject(err);
//                     return;
//                 }
//                 resolve(result);
//                 console.log("🚀 ~ signUp ~ result:", result);
//             }
//         );
//     })

// }


// export function confirmRegistration({ email, otpCode }: ConfirmRegisteration): Promise<any> {
//     const user = cognitoUser(email);
//     return new Promise((resolve, reject) => {
//         user.confirmRegistration(otpCode, true, (err, result) => {
//             if (err) {
//                 console.log("🚀 ~ confirmRegistration ~ err:", err);
//                 reject(err);
//                 return;
//             }
//             resolve(result);
//             console.log("🚀 ~ confirmRegistration ~ result:", result);
//         });
//     });
// }


// export function resendConfirmationCode(email: string) {
//     const user = cognitoUser(email);
//     return new Promise((resolve, reject) => {
//         user.resendConfirmationCode((err, result) => {
//             if (err) {
//                 console.log("🚀 ~ resendConfirmationCode ~ err:", err);
//                 reject(err)
//                 return;
//             }
//             resolve(result);
//             console.log("🚀 ~ resendConfirmationCode ~ result:", result);
//         }
//         );
//     })
// }


// export function signIn({ email, password }: Omit<SignUpCredential, 'phoneNumber'>): Promise<CognitoUserSession | undefined> {
//     const user = cognitoUser(email);

//     const authenticationDetails = new AuthenticationDetails({
//         Username: email,
//         Password: password,
//     });

//     user.authenticateUser

//     return new Promise((resolve, reject) => {
//         user.authenticateUser(authenticationDetails, {
//             onSuccess(session) {
//                 resolve(session);
//             },
//             onFailure(err) {
//                 reject(err);
//             },
//         });
//     })

// }


// export async function getOAuth2Token(code: string) {

//     const cognitoDomain = process.env.AWS_COGNITO_DOMAIN;
//     const clientId = process.env.AUTH_COGNITO_ID;
//     const clientSecret = process.env.AWS_COGNITO_GOOGLE_IDP_CLIENT_SECRET || '';
//     if (!clientSecret) {
//         throw new Error("Missing AWS_COGNITO_GOOGLE_IDP_CLIENT_SECRET environment variable");
//     }

//     if (!cognitoDomain || !clientId) {
//         throw new Error(
//             "Missing required environment variables for OAuth authorize URL"
//         );
//     }



//     const headers = {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
//     };
//     console.log("🚀 ~ getOAuth2Token ~ headers:", headers)

//     const body = new URLSearchParams({
//         redirect_uri: 'http://localhost:3000/login',
//         client_id: clientId as string,
//         code,
//     });
//     console.log("🚀 ~ getOAuth2Token ~ body:", body)

//     const res = await fetch(`${cognitoDomain}/oauth2/token`, {
//         method: 'POST',
//         headers,
//         body
//     });

//     console.log("🚀 ~ getOAuth2Token ~ res:", res)

// }

// export function forgotPassword({ email, onSuccess, onFailure, inputVerificationCode }: ForgotPassword) {
//     const user = cognitoUser(email);
//     user.forgotPassword({ onSuccess, onFailure, inputVerificationCode })
// }


// export function confirmForgotPassword({ email, otpCode, newPassword, onSuccess, onFailure }: ConfirmForgotPassword) {
//     const user = cognitoUser(email);
//     user.confirmPassword(otpCode, newPassword, { onSuccess, onFailure });
// }


// export function signOut() {
//     const user = userPool.getCurrentUser();
//     if (user) {
//         user.signOut();
//     }
// }