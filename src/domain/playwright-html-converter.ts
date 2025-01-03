import { chromium, Browser, Page } from 'playwright'

import PQueue from 'p-queue'
import ApplicationError from './application-error'
import { ConvertType } from './convert-type'

const queue: PQueue = new PQueue({ concurrency: process.env.CONVERT_QUEUE_CONCURRENCY ? Number.parseInt(process.env.CONVERT_QUEUE_CONCURRENCY) : 10 })

const PDF_HEADER_TEMPLATE: string = '<html> <head> <style type="text/css"> #header{padding: 0;}.content{width: 100%; margin: 5px; padding-top:5px; -webkit-print-color-adjust: exact; vertical-align: middle; font-size: 15px; display: inline-block; text-align: center;}</style> </head> <body> <div class="content"> <span class="title"></span> - <span class="date"></span> </div></body></html>'

const PDF_FOOTER_TEMPLATE: string = '<html> <head> <style type="text/css"> #footer{padding: 0;}.content-footer{width: 100%; padding: 5px; -webkit-print-color-adjust: exact; vertical-align: middle; font-size: 15px; margin-top: 0; display: inline-block; text-align: center;}</style> </head> <body> <div class="content-footer"> Page <span class="pageNumber"></span> of <span class="totalPages"></span> </div></body></html>'

export async function convertHtmlToType(
    {
        html,
        uniqueJobID,
        convertType
    }: {
        html: string,
        uniqueJobID: string,
        convertType: ConvertType
    }
): Promise<string> {
    console.log(`${uniqueJobID}: Adding item to queue. Items waiting in the queue: ${queue.size}`)
    const result = await queue.add(async () => await convertWithPlaywright({ html, convertType }))
    console.log(`${uniqueJobID}: Removed item from queue. Items waiting in the ququeue: ${queue.size}`)
    if (!result) {
        console.error(`${uniqueJobID}: Failed to resolve item from processing queue and it was void: '${result}'`)
        throw new ApplicationError(`Failed to convert html to ${convertType}`)
    }
    return result
}

async function convertWithPlaywright({ html, convertType }: { html: string, convertType: ConvertType }): Promise<string> {
    let browser: Browser | undefined = undefined
    let page: Page

    try {
        browser = await chromium.launch({
            headless: true,
            args: ['--arcvm-use-hugepages']
        })

        page = await browser.newPage()
        await page.setContent(html)
        return await convertToType({ page, convertType })
    } catch (error) {
        console.error('Convertion failed with error: ', error)
        throw new ApplicationError('Failed to convert hrml to ' + convertType)
    } finally {
        try {
            if (browser) {
                await browser.close()
            }
        } catch (error) {
            console.error('Error while closing blowser: ', error)
        }
    }
}

async function convertToType({ page, convertType }: { page: Page, convertType: ConvertType }): Promise<string> {
    switch (convertType) {
        case ConvertType.PDF:
            return await convertToPdf({ page })
        case ConvertType.PNG:
            return await convertToPng({ page })
        case ConvertType.JPEG:
            return await convertToJpeg({ page })
        default:
            throw new ApplicationError('Unknown convert type')
    }
}

async function convertToPdf({ page }: { page: Page }): Promise<string> {
    return (await page.pdf({
        format: 'A3',
        displayHeaderFooter: true,
        headerTemplate: PDF_HEADER_TEMPLATE,
        footerTemplate: PDF_FOOTER_TEMPLATE,
        printBackground: true,
        margin: {
            top: '10mm',
            bottom: '10mm',
            left: '10mm',
            right: '10mm'
        }
    })).toString('base64')
}

async function convertToPng({ page }: { page: Page }): Promise<string> {
    return (await page.screenshot({
        fullPage: true,
        omitBackground: true,
        type: 'png',
    })).toString('base64')
}

async function convertToJpeg({ page }: { page: Page }): Promise<string> {
    return (await page.screenshot({
        fullPage: true,
        omitBackground: true,
        quality: 50,
        type: 'jpeg'
    })).toString('base64')
}

