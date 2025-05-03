import * as z from 'zod';

export const RegistrationSchema = z.object({
    username: z.string().min(5, 'Username must be at least 5 characters long'),
    email: z.string().email(),
    password: z.string(),
    rePassword: z.string(),
});

export type IRegistrationInput = z.infer<typeof RegistrationSchema>;
