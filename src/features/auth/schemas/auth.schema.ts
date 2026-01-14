import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const signUpFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
  code: z.string("OTP code is required").length(6, "OTP code must be 6 characters"),
  role: z.enum(["Listener", "Label"]),
  labelType: z.enum(["INDIVIDUAL", "COMPANY"]).optional(),
  labelName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    if (data.role === "Label" && !data.labelType) {
      return false;
    }
    return true;
  },
  {
    message: "Label type is required when registering as a label",
    path: ["labelType"],
  }
).refine(
  (data) => {
    if (data.role === "Label" && !data.labelName) {
      return false;
    }
    return true;
  },
  {
    message: "Label name is required when registering as a label",
    path: ["labelName"],
  }
);

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  confirmNewPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
