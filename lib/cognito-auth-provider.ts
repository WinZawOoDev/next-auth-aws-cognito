import { CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';


const UserPoolId = process.env.AWS_COGNITO_USER_POOL_ID || '';
console.log("🚀 ~ UserPoolId:", UserPoolId)
const ClientId = process.env.AWS_COGNITO_USER_POOL_CLIENT_ID || '';
console.log("🚀 ~ ClientId:", ClientId)


const userPool = new CognitoUserPool({ UserPoolId, ClientId });


const attributeList: CognitoUserAttribute[] = [];

const attributeEmail = new CognitoUserAttribute({
    Name: "email",
    Value: "winzawoo.dev@gmail.com",
})

attributeList.push(attributeEmail);

const attributePhoneNumber = new CognitoUserAttribute({
    Name: "phone_number",
    Value: "+959123456789",
})

attributeList.push(attributePhoneNumber);


export function signUp(username: string, password: string) {
    userPool.signUp(
        username,
        password,
        attributeList,
        attributeList,
        (err, result) => {
            if (err) {
                console.log("🚀 ~ signUp ~ err:", err);
                return;
            }
            console.log("🚀 ~ signUp ~ result:", result);
        }
    );
}


export function verifyRegister(email: string, otpCode: string) {

    const cognitoUser = new CognitoUser({
        Username: 'winzawoo.dev@gmail.com',
        Pool: userPool
    });

    cognitoUser.confirmRegistration(otpCode.toString(), true, (err, result) => {
        if (err) {
            console.log("🚀 ~ verifyRegister ~ err:", err);
            return;
        }
        console.log("🚀 ~ verifyRegister ~ result:", result);
    });
}

