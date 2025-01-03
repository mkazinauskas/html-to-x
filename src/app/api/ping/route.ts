'server-only'

import { ConvertType } from '@/domain/convert-type'
import { convertHtmlToType } from '@/domain/playwright-html-converter'
import { NextRequest, NextResponse } from 'next/server'
import { HTTP_REQUEST_FOR_PING } from './sample-html'

export type Response = {
    status: string
}

export async function GET(request: NextRequest): Promise<NextResponse<Response>> {
    const checkType = request.nextUrl.searchParams.get('type') ?? 'Undefined Health'

    try {
        const result = await convertHtmlToType({
            html: HTTP_REQUEST_FOR_PING,
            uniqueJobID: `${checkType} Check ${new Date().toISOString()}`,
            convertType: ConvertType.PDF
        })
        const pdf = Buffer.from(result, 'base64').toString()
        if (!pdf.length) {
            console.error('Ping failed: PDF has no length.')
            shutdown()
            return fail()
        }
        if (pdf.length < 10000) {
            console.error('Ping failed: PDF has leght less than 10000')
            shutdown()
            return fail()
        }
        console.log('Ping was successfull')
        return ok()
    } catch (e) {
        console.error('Ping failed: ', e)
        shutdown()
        return fail()
    }
}

async function shutdown() {
    if (process.env.SHUTDOWN_ON_FAILED_PING?.toUpperCase() !== 'TRUE') {
        console.log('Ping failed. Shutting down of application on failed ping is disabled.')
    }
    setTimeout(() => {
        console.log('Shutting down the application')
        process.exit(0)
    }, 2000)
}

function ok(): NextResponse<Response> {
    return NextResponse.json({ status: 'OK' } as Response, { status: 200 })
}

function fail(): NextResponse<Response> {
    return NextResponse.json({ status: 'FAILED' } as Response, { status: 500 })
}