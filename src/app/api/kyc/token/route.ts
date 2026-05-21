// src/app/api/kyc/token/route.ts
// Server-side route — SmileID API key never exposed to browser
// Must run in Node.js runtime (not Edge) because smile-identity-core uses CommonJS
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        const PARTNER_ID   = process.env.SMILE_ID_PARTNER_ID;
        const API_KEY      = process.env.SMILE_ID_API_KEY;
        const CALLBACK_URL = process.env.SMILE_ID_CALLBACK_URL;
        const SID_SERVER   = process.env.SMILE_ID_SERVER ?? '0';

        if (!PARTNER_ID || !API_KEY || !CALLBACK_URL) {
            console.error('[KYC token] Missing env vars:', {
                PARTNER_ID: !!PARTNER_ID,
                API_KEY: !!API_KEY,
                CALLBACK_URL: !!CALLBACK_URL,
            });
            return NextResponse.json(
                { error: 'SmileID not configured. Add SMILE_ID_PARTNER_ID, SMILE_ID_API_KEY and SMILE_ID_CALLBACK_URL to .env.local' },
                { status: 500 }
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        let SIDCore: any;
        try {
            SIDCore = require('smile-identity-core');
        } catch (requireErr: any) {
            console.error('[KYC token] smile-identity-core not found:', requireErr.message);
            return NextResponse.json(
                { error: 'smile-identity-core is not installed. Run: npm install smile-identity-core --legacy-peer-deps in your frontend project' },
                { status: 500 }
            );
        }
        const WebApi = SIDCore.WebApi;

        const connection = new WebApi(PARTNER_ID, CALLBACK_URL, API_KEY, SID_SERVER);

        const jobId = `job-${crypto.randomUUID()}`;
        const request_params = {
            user_id:      `homz-${userId}-${crypto.randomUUID()}`,
            job_id:       jobId,
            product:      'doc_verification',
            callback_url: CALLBACK_URL,
        };

        const result = await connection.get_web_token(request_params);

        return NextResponse.json({ ...result, jobId });
    } catch (err: any) {
        const detail = err?.response?.data || err?.message || err;
        const errorCode = typeof detail === 'object' ? detail?.code : '';
        const errorMsg  = typeof detail === 'object' ? detail?.error : String(detail);

        console.error('[KYC token] SmileID error:', JSON.stringify(detail, null, 2));

        // Code 2209 = user already enrolled in SmileID — verification was previously completed
        if (errorCode === '2209' || String(errorMsg).includes('already enrolled')) {
            return NextResponse.json(
                { error: 'ALREADY_ENROLLED', message: 'You have already completed identity verification with SmileID.' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: err?.message || 'Failed to generate KYC token', detail },
            { status: 500 }
        );
    }
}