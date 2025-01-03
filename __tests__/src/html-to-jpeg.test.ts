import { executeRequest } from './__helpers/request-executor'
import { SAMPLE_BASE64_ENCODED_HTML } from './__helpers/sample-base64-encoded-html'

describe('Test HTML to JPEG', () => {
    it('Successfully converts HTML to JPEG', async () => {
        const result = await executeRequest({
            request: {
                url: '/api/html-to-jpeg',
                body: {
                    base64EncodedHtml: SAMPLE_BASE64_ENCODED_HTML
                }
            }

        })
        const resultJson = await result.json()
        expect(resultJson.base64EncodedJpeg).toBeDefined()

        const decoded = Buffer.from(resultJson.base64EncodedJpeg, 'base64').toString('binary')
        expect(decoded).toBeDefined()
    })

})