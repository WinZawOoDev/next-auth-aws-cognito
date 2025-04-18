import { CognitoUser, CognitoUserAttribute, CognitoUserPool, AuthenticationDetails, ISignUpResult, CognitoUserSession, IAuthenticationCallback } from 'amazon-cognito-identity-js';

type SignUpCredential = {
    email: string;
    phoneNumber?: string
    password: string;
}

type ConfirmRegisteration = Pick<SignUpCredential, 'email'> & { otpCode: string };

type SignIn = Omit<SignUpCredential, 'phoneNumber'> & IAuthenticationCallback

type ForgotPassword = Pick<SignUpCredential, 'email'> & { onSuccess: (data: any) => void; onFailure: (error: Error) => void; inputVerificationCode: (data: any) => void; }

type ConfirmForgotPassword = Pick<SignUpCredential, 'email'> & { otpCode: string; newPassword: string; onSuccess: (success: string) => void; onFailure: (error: Error) => void; }

const UserPoolId = process.env.AWS_COGNITO_USER_POOL_ID || '';
console.log("🚀 ~ UserPoolId:", UserPoolId)
const ClientId = process.env.AWS_COGNITO_USER_POOL_CLIENT_ID || '';
console.log("🚀 ~ ClientId:", ClientId)


const userPool = new CognitoUserPool({ UserPoolId, ClientId });
const cognitoUser = (email: string) => new CognitoUser({ Username: email, Pool: userPool });


export function signUp({ email, phoneNumber, password }: SignUpCredential): Promise<ISignUpResult | undefined> {

    const attributeList: CognitoUserAttribute[] = [];

    const attributeEmail = new CognitoUserAttribute({
        Name: "email",
        Value: email,
    })

    attributeList.push(attributeEmail);

    if (phoneNumber) {
        const attributePhoneNumber = new CognitoUserAttribute({
            Name: "phone_number",
            Value: "+959123456789",
        })
        attributeList.push(attributePhoneNumber);
    }

    return new Promise((resolve, reject) => {
        userPool.signUp(
            email,
            password,
            attributeList,
            attributeList,
            (err, result) => {
                if (err) {
                    console.log("🚀 ~ signUp ~ err:", err);
                    reject(err);
                    return;
                }
                resolve(result);
                console.log("🚀 ~ signUp ~ result:", result);
            }
        );
    })

}


export function confirmRegistration({ email, otpCode }: ConfirmRegisteration): Promise<any> {
    const user = cognitoUser(email);
    return new Promise((resolve, reject) => {
        user.confirmRegistration(otpCode, true, (err, result) => {
            if (err) {
                console.log("🚀 ~ confirmRegistration ~ err:", err);
                reject(err);
                return;
            }
            resolve(result);
            console.log("🚀 ~ confirmRegistration ~ result:", result);
        });
    });
}


export function resendConfirmationCode(email: string) {
    const user = cognitoUser(email);
    return new Promise((resolve, reject) => {
        user.resendConfirmationCode((err, result) => {
            if (err) {
                console.log("🚀 ~ resendConfirmationCode ~ err:", err);
                reject(err)
                return;
            }
            resolve(result);
            console.log("🚀 ~ resendConfirmationCode ~ result:", result);
        }
        );
    })
}


export function signIn({ email, password, onSuccess, onFailure }: SignIn) {
    const user = cognitoUser(email);

    const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
    });

    user.authenticateUser(authenticationDetails, { onSuccess, onFailure });
}


export function forgotPassword({ email, onSuccess, onFailure, inputVerificationCode }: ForgotPassword) {
    const user = cognitoUser(email);
    user.forgotPassword({ onSuccess, onFailure, inputVerificationCode })
}


export function confirmForgotPassword({ email, otpCode, newPassword, onSuccess, onFailure }: ConfirmForgotPassword) {
    const user = cognitoUser(email);
    user.confirmPassword(otpCode, newPassword, { onSuccess, onFailure });
}
