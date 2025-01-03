import { executeRequest } from './__helpers/request-executor'
import { SAMPLE_BASE64_ENCODED_HTML } from './__helpers/sample-base64-encoded-html'

describe('Test HTML to PDF', () => {
    it('Successfully converts HTML to PDF', async () => {
        const result = await executeRequest({
            request: {
                url: '/api/html-to-pdf',
                body: {
                    base64EncodedHtml: SAMPLE_BASE64_ENCODED_HTML
                }
            }

        })
        const resultJson = await result.json()
        expect(resultJson.base64EncodedPdf).toBeDefined()

        const decoded = Buffer.from(resultJson.base64EncodedPdf, 'base64').toString('binary')
        expect(decoded.substring(0, 8)).toBe('%PDF-1.4')
    })

})