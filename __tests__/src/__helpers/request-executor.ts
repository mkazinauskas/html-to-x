export async function executeRequest({ request }: { request: { url: string, body: unknown } }) {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + request.url, {
        method: 'POST',
        body: JSON.stringify(request.body),
        headers: {
            'Content-Type': 'application/json',
        },
    })
}