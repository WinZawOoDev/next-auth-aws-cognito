import { z } from "zod";

export const registerSchema = z
    .object({
        name: z.string().min(2, {
            message: "Name must be at least 2 characters.",
        }),
        email: z.string().email({
            message: "Please enter a valid email address.",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
        confirmPassword: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterSchemaError = z.inferFlattenedErrors<typeof registerSchema>["fieldErrors"];


export const otpSchema = z.object({
    otpCode: z
        .string()
        .length(6, { message: "OTP must be exactly 6 digits" })
        .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export type OTPSchemaError = z.inferFlattenedErrors<typeof otpSchema>["fieldErrors"];


export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export type ResetPasswordSchemaError = z.inferFlattenedErrors<typeof resetPasswordSchema>["fieldErrors"];