import { z } from 'zod'

export type ValidationErrorResponse = {
    error: ValidationErrorItem
}

export type ValidationErrorItem = {
    message: string,
    errors: z.ZodIssue[]
}