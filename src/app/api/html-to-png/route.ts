'server-only'

import { ConvertType } from '@/domain/convert-type'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ApplicationErrorResponse } from '../_commons/application-error-response'
import { convertHtml } from '../_commons/converter-function'
import { ValidationErrorResponse } from '../_commons/validation-error-response'
import { ValidationRules } from '../_commons/validation-rules'

const RequestSchema = z.object({
    base64EncodedHtml: ValidationRules.base64EncocedHtml
})

type Request = z.infer<typeof RequestSchema>

type Response = {
    base64EncodedPng: string
}

export async function POST(request: NextRequest): Promise<NextResponse<Response | ValidationErrorResponse | ApplicationErrorResponse>> {
    return await convertHtml<Request, Response>(
        {
            request,
            requestSchema: RequestSchema,
            requestTransformerFunction: (requestBody: Request) => requestBody.base64EncodedHtml,
            convertType: ConvertType.PNG,
            resultTransformerFunction: (result) => { return { base64EncodedPng: result } as Response }
        }
    )
}