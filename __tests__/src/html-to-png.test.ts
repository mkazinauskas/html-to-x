import { executeRequest } from './__helpers/request-executor'
import { SAMPLE_BASE64_ENCODED_HTML } from './__helpers/sample-base64-encoded-html'

describe('Test HTML to PNG', () => {
    it('Successfully converts HTML to PNG', async () => {
        const result = await executeRequest({
            request: {
                url: '/api/html-to-png',
                body: {
                    base64EncodedHtml: SAMPLE_BASE64_ENCODED_HTML
                }
            }

        })
        const resultJson = await result.json()
        expect(resultJson.base64EncodedPng).toBeDefined()

        const decoded = Buffer.from(resultJson.base64EncodedPng, 'base64').toString('binary')
        expect(decoded.substring(0, 4)).toContain('PNG')
    })

})