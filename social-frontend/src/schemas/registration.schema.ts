import * as z from 'zod';

export const RegistrationSchema = z
    .object({
        username: z.string().min(5, 'Username must be at least 5 characters long'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
        rePassword: z.string().min(8, 'Password must be at least 8 characters long'),
    })
    .refine(values => values.rePassword === values.password, {
        message: 'Passwords do not match',
        path: ['rePassword'],
    });

export type IRegistrationInput = z.infer<typeof RegistrationSchema>;
