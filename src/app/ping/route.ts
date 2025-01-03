
import { convert } from "@/domain/playwright-html-converter";
import { NextRequest, NextResponse } from "next/server";

export type HealthResponse = {
    status: string;
};

export async function GET(request: NextRequest): Promise<NextResponse<HealthResponse>> {
    const checkType = request.nextUrl.searchParams.get('type') ?? 'Undefined Health'

    const html = '<h1>Hello World!</h1>';

    try {
        const result = await convert({
            html,
            uniqueJobID: `${checkType} Check ${new Date().toISOString()}`
        });
        const pdf = Buffer.from(result, "base64").toString();
        if (!pdf.length) {
            console.log('PDF has no lenght')
            return fail()
        }
        if (pdf.length < 10000) {
            console.log('PDF has leght less than 10000')
            return fail()
        }
        return ok()
    } catch (e) {
        console.error(e)
        return fail()
    }
}

function ok(): NextResponse<HealthResponse> {
    return NextResponse.json({ status: 'ok' } as HealthResponse, { status: 200 })
}

function fail(): NextResponse<HealthResponse> {
    return NextResponse.json({ status: 'service is not healty' } as HealthResponse, { status: 500 })
}