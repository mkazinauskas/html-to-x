
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ValidationErrorResponse } from "../_commons/validation-error-response";
import { ApplicationErrorResponse } from "../_commons/application-error-response";
import { convert } from "@/domain/playwright-html-converter";
import ApplicationError from "@/domain/application-error";
import { ConvertType } from "@/domain/convert-type";

const RequestSchema = z.object({
    base64EncodedHtml: z
        .string({ description: "Base64 encoded HTML" })
        .base64({ message: "Base64 encoded HTML is invalid" }),
});

export type Request = z.infer<typeof RequestSchema>;

export type Response = {
    base64EncodedPng: string;
};

export async function POST(request: NextRequest): Promise<NextResponse<Response | ValidationErrorResponse | ApplicationErrorResponse>> {
    const uniqueJobID = crypto.randomUUID()
    console.log(`${uniqueJobID}: Received request`);
    const requestBody: Request = await request.json();

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

        const result = await convert({ html, uniqueJobID, convertType: ConvertType.PNG })

        return NextResponse.json({
            base64EncodedPng: result
        } as Response, { status: 200 })

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