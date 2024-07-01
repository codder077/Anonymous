import {z } from "zod"

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, {message: 'Content must be of atleast of 10 characters'})
    .max(300, {message: 'Content must bo no longer than 300 characters'})

})