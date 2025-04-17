import { signUp, confirmRegistration, resendConfirmationCode, signIn, forgotPassword, confirmForgotPassword } from '@/lib/cognito-auth-provider';
import { NextResponse } from 'next/server';

export async function GET() {

    // signUp('winzawoo.dev@gmail.com', '3f90f3*33oWinZawOo');

    // confirmRegistration('winzawoo.dev@gmail.com', '732566');
    
    // resendConfirmationCode('winzawoo.dev@gmail.com');

    signIn({
        email: 'winzawoo.dev@gmail.com',
        password: '3f90f3*33oWinZawO0Update',
        onSuccess(session, userConfirmationNecessary) {
            console.log("🚀 ~ signIn ~ session:", session);
            console.log("🚀 ~ signIn ~ userConfirmationNecessary:", userConfirmationNecessary);
        },
        onFailure(err) {
            console.log("🚀 ~ signIn ~ err:", err);
        },
    });

    // forgotPassword('winzawoo.dev@gmail.com');

    // confirmForgotPassword('winzawoo.dev@gmail.com', '378054', '3f90f3*33oWinZawO0Update');

    return NextResponse.json({ message: 'Hello, this is your GET API route!' });
}