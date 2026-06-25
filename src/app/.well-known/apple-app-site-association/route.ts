import { NextResponse } from 'next/server'

export async function GET() {
    const data = {
        applinks: {
            apps: [],
            details: [
                {
                    appID: '4XZ5DC53HV.com.homzfrontltd.homz',
                    paths: ['*'],
                },
            ],
        },
    }

    return NextResponse.json(data, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
}