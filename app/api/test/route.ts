import { NextResponse } from 'next/server';
import { authenticate, getAllUsers, getUserInfo } from "@/lib/active-directory";

export async function GET() {

    const isAuthenticated = await authenticate({ username: 'wzo@kbz.bank', password: '1#$!30WeER0' })

    // console.log('Authenticated successfully');

    const userInfo = await getUserInfo({ username: 'wzo@kbz.bank', password: '1#$!30WeER0' });
    console.log("🚀 ~ GET ~ userInfo:", userInfo)

    const users = await getAllUsers({ username: 'wzo@kbz.bank', password: '1#$!30WeER0' });
    console.log("🚀 ~ GET ~ users:", users)

    return NextResponse.json({ message: 'Hello, this is your GET API route!' });
}