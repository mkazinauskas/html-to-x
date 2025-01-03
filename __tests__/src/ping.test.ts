
describe('Test PING endpoint', () => {
    it('Successfuly pings the API', async () => {
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ping`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        expect(result.status).toBe(200)

        const resultJson = await result.json()
        expect(resultJson.status).toBe('OK')

    })
})