import { NextResponse } from 'next/server'

export async function GET() {
    const data = [
        {
            relation: ['delegate_permission/common.handle_all_urls'],
            target: {
                namespace: 'android_app',
                package_name: 'com.emirace.homz',
                sha256_cert_fingerprints: [
                    'BF:BF:EC:E7:15:1D:1F:FF:09:5E:73:DF:CF:B8:6E:A7:E8:AF:70:80:F4:F0:EE:4E:5E:E8:C8:B8:4A:1D:A2:C4',
                ],
            },
        },
    ]

    return NextResponse.json(data, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
}