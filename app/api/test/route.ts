import { NextResponse } from 'next/server';
import { authenticate, getAllUsers, getUserInfo } from "@/lib/active-directory";
import { listGroups } from '@/lib/auth/cognito-identity-client';

export async function GET() {

    const groupLists = await listGroups();
    console.log("🚀 ~ GET ~ groupLists:", groupLists);

    return NextResponse.json({ message: 'Hello, this is your GET API route!' });
}