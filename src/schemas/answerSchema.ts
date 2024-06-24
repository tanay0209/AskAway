import { z } from "zod"


export const answerSchema = z.object({
    content: z
        .string()
        .min(1, "Answer cannot be empty")
        .max(300, "Message should not be longer than 300 characters")

})