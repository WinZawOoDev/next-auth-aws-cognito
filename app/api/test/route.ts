import { getSigningKey, getUser, initiateAuth, listUsers, signUp } from '@/lib/auth/cognito-identity-client';
import { NextResponse } from 'next/server';

export async function GET() {

    // await signUp({email: "winzawoo.dev@gmail.com", password: "12@#Wi0#nio8"});
    // await listUsers();
    // await  initiateAuth({email: "winzawoo.dev@gmail.com", "password": "12@#Wa909AZn$"})
    // await getUser();
    await getSigningKey()

    return NextResponse.json({ message: 'Hello, this is your GET API route!' });
}