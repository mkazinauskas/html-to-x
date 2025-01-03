import ApplicationError from '@/domain/application-error'
import { ConvertType } from '@/domain/convert-type'
import { convertHtmlToType } from '@/domain/playwright-html-converter'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ApplicationErrorResponse } from '../_commons/application-error-response'
import { ValidationErrorResponse } from '../_commons/validation-error-response'

export async function convertHtml<REQ, RES>(
    {
        request,
        requestSchema,
        requestTransformerFunction,
        convertType,
        resultTransformerFunction,
    }: {
        request: NextRequest,
        requestSchema: z.ZodSchema<REQ>,
        requestTransformerFunction: (requestBody: REQ) => string,
        convertType: ConvertType
        resultTransformerFunction: (result: string) => RES
    }
): Promise<NextResponse<RES | ValidationErrorResponse | ApplicationErrorResponse>> {
    const uniqueJobID = crypto.randomUUID()
    console.log(`${uniqueJobID}: Received request to convert html to ${convertType}`)

    const requestJson: Request = await request.json()
    const validatedRequest = requestSchema.safeParse(requestJson)

    if (!validatedRequest.success) {
        const { errors } = validatedRequest.error

        return NextResponse.json(
            {
                error: { message: 'Invalid request', errors },
            } as ValidationErrorResponse,
            { status: 400 }
        )
    }

    try {
        const html = Buffer.from(requestTransformerFunction(validatedRequest.data), 'base64').toString()

        const result = await convertHtmlToType({ html, uniqueJobID, convertType })

        return NextResponse.json(resultTransformerFunction(result), { status: 200 })
    } catch (error: unknown) {
        console.error(`${uniqueJobID}: Failed with error`, error)

        if (error instanceof ApplicationError) {
            return NextResponse.json(
                {
                    error: error.message
                } as ApplicationErrorResponse,
                { status: 500 }
            )
        }
        return NextResponse.json(
            {
                error: 'Application has failed for unknown reason. Please contact administrator'
            } as ApplicationErrorResponse,
            { status: 500 }
        )
    }
}