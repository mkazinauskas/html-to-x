
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ValidationErrorResponse } from "../_commons/validation-error-response";
import { ApplicationErrorResponse } from "../_commons/application-error-response";
import { convert } from "@/domain/playwright-html-converter";
import ApplicationError from "@/domain/application-error";

export type PdfRequest = {
    base64EncodedHtml: string;
};

export type PdfResponse = {
    base64EncodedPdf: string;
};

const RequestSchema = z.object({
    base64EncodedHtml: z.string({ description: "Base64 encoded HTML" }),
});

export async function POST(request: NextRequest): Promise<NextResponse<PdfResponse | ValidationErrorResponse | ApplicationErrorResponse>> {
    const uniqueJobID = crypto.randomUUID()
    console.log(`${uniqueJobID}: Received request`);
    const requestBody: PdfRequest = await request.json();

    const response = RequestSchema.safeParse(requestBody);

    if (!response.success) {
        const { errors } = response.error;

        return NextResponse.json(
            {
                error: { message: "Invalid request", errors },
            } as ValidationErrorResponse, { status: 400 }
        )
    }

    try {
        const html = Buffer.from(requestBody.base64EncodedHtml, "base64").toString();

        const result = await convert({ html, uniqueJobID })

        return NextResponse.json({
            base64EncodedPdf: result
        } as PdfResponse, { status: 200 })

    } catch (e: Error | unknown) {
        if (e instanceof ApplicationError) {
            console.error(`${uniqueJobID}: Failed with Application Error`);
            return NextResponse.json({
                error: e.message
            } as ApplicationErrorResponse, { status: 500 })
        }
        console.error(`${uniqueJobID}: Failed with General error`);
        return NextResponse.json({
            error: 'Application has failed for unknown reason. Please contact administrator'
        } as ApplicationErrorResponse, { status: 500 })
    }
}