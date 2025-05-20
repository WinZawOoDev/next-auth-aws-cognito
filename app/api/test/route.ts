import { NextResponse } from 'next/server';
import { authenticate, getUserInfo } from "@/lib/active-directory";

export async function GET() {

    const isAuthenticated = await authenticate('jack@winzawoo.site', '1#$!30WeER0')

    console.log('Authenticated successfully');

    const userInfo = await getUserInfo('jack@winzawoo.site', '1#$!30WeER0');
    console.log("🚀 ~ GET ~ userInfo:", userInfo)

    return NextResponse.json({ message: 'Hello, this is your GET API route!' });
}