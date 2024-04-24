import { z } from "zod"


export const signinSchena = z.object({
    identifier: z.string(),
    password: z.string()
})