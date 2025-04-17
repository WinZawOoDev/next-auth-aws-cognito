import { signUp, confirmRegistration, resendConfirmationCode, signIn } from '@/lib/cognito-auth-provider';
import { NextResponse } from 'next/server';

export async function GET() {

    // signUp('winzawoo.dev@gmail.com', '3f90f3*33oWinZawOo');

    // confirmRegistration('winzawoo.dev@gmail.com', '732566');
    // resendConfirmationCode('winzawoo.dev@gmail.com');

    signIn('winzawoo.dev@gmail.com', '3f90f3*33oWinZawOo');

    return NextResponse.json({ message: 'Hello, this is your GET API route!' });
}