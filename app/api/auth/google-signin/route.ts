import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Retrieve query parameters
    const { searchParams } = new URL(request.url);
    console.log("🚀 ~ GET ~ searchParams:", searchParams)

    const someParam = searchParams.get('someParam');

    // Create a JSON response
    const responseData = {
        message: 'GET endpoint reached',
        someParam: someParam || null,
    };

    return NextResponse.redirect(new URL('/', request.nextUrl))
}