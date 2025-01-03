import { z } from "zod"

export type ValidationErrorItem = {
    message: string,
    errors: z.ZodIssue[]
}