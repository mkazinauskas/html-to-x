import { z } from 'zod'

export const ValidationRules = {
    base64EncocedHtml: z
        .string({ description: 'Base64 encoded HTML' })
        .base64({ message: 'Base64 encoded HTML is invalid' })
}