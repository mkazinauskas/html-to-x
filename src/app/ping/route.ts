
import { ConvertType } from "@/domain/convert-type";
import { convert } from "@/domain/playwright-html-converter";
import { NextRequest, NextResponse } from "next/server";
import { sampleHtml } from "./sample-html";

export type HealthResponse = {
    status: string;
};

export async function GET(request: NextRequest): Promise<NextResponse<HealthResponse>> {
    const checkType = request.nextUrl.searchParams.get('type') ?? 'Undefined Health'

    try {
        const result = await convert({
            html: sampleHtml,
            uniqueJobID: `${checkType} Check ${new Date().toISOString()}`,
            convertType: ConvertType.PDF
        });
        const pdf = Buffer.from(result, "base64").toString();
        if (!pdf.length) {
            console.error('PDF has no length')
            return fail()
        }
        if (pdf.length < 10000) {
            console.error('PDF has leght less than 10000')
            return fail()
        }
        console.log('Ping was successfull')
        return ok()
    } catch (e) {
        console.error('Ping failed: ', e)
        return fail()
    }
}

function ok(): NextResponse<HealthResponse> {
    return NextResponse.json({ status: 'ok' } as HealthResponse, { status: 200 })
}

function fail(): NextResponse<HealthResponse> {
    return NextResponse.json({ status: 'service is not healty' } as HealthResponse, { status: 500 })
}