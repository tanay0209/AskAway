import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, 'Username should be a max of 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, "Username should not contain special characters")


export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password must be atleast 6 characters" })
})