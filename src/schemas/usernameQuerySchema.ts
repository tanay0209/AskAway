import { usernameValidation } from "@/schemas/signupSchema"
import * as z from 'zod'


export const UsernameQuerySchema = z.object({
    username: usernameValidation
})