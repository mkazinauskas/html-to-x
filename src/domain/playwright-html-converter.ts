import { chromium, Browser, Page } from 'playwright';

import PQueue from 'p-queue';
import ApplicationError from './application-error';

const queue: PQueue = new PQueue({ concurrency: 3 });

const headerTemplate: string = '<html> <head> <style type="text/css"> #header{padding: 0;}.content{width: 100%; margin: 5px; padding-top:5px; -webkit-print-color-adjust: exact; vertical-align: middle; font-size: 15px; display: inline-block; text-align: center;}</style> </head> <body> <div class="content"> <span class="title"></span> - <span class="date"></span> </div></body></html>'

const footerTemplate: string = '<html> <head> <style type="text/css"> #footer{padding: 0;}.content-footer{width: 100%; padding: 5px; -webkit-print-color-adjust: exact; vertical-align: middle; font-size: 15px; margin-top: 0; display: inline-block; text-align: center;}</style> </head> <body> <div class="content-footer"> Page <span class="pageNumber"></span> of <span class="totalPages"></span> </div></body></html>'

export async function convert({ html, uniqueJobID }: { html: string, uniqueJobID: string }): Promise<string> {
    console.log(`${uniqueJobID}: Adding item to queue. Items waiting in the queue: ${queue.size}`);
    const result = await queue.add(async () => await doPlaywright({ html }));
    console.log(`${uniqueJobID}: Resolved. Items waiting in the ququeue: ${queue.size}`);
    if (!result) {
        console.error(`${uniqueJobID}: Failed to resolve item from processing queue and it was void: '${result}'`);
        throw new ApplicationError('Failed to queue item to processing queue');
    }
    return result
}

async function doPlaywright({ html }: { html: string }): Promise<string> {
    let browser: Browser | undefined = undefined;
    let page: Page;

    try {
        // Launch the browser
        browser = await chromium.launch({
            headless: true,
            args: ['--arcvm-use-hugepages']
        });

        // Create a new page
        page = await browser.newPage();

        await page.setContent(html);

        return (await page.pdf({
            format: 'A3',
            displayHeaderFooter: true,
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate,
            printBackground: true,
            margin: {
                top: '10mm',
                bottom: '10mm',
                left: '10mm',
                right: '10mm'
            }
        })).toString('base64');
    } catch (error) {
        console.error('Error:', error);
        throw new ApplicationError('Failed to generate PDF');
    } finally {
        try {
            if (browser) {
                await browser.close();
            }
        } catch (error) {
            console.error('Error while closing blowser: ', error);
        }
    }
}