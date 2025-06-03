import { z } from 'zod';

// Базовые схемы валидации
export const emailSchema = z
  .string()
  .email('Некорректный email адрес')
  .min(1, 'Email не может быть пустым');

export const passwordSchema = z
  .string()
  .min(6, 'Пароль должен содержать минимум 6 символов')
  .max(128, 'Пароль слишком длинный');

export const nameSchema = z
  .string()
  .min(2, 'Имя должно содержать минимум 2 символа')
  .max(50, 'Имя слишком длинное');

// Схемы для форм
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Пароль не может быть пустым'),
});

export const registerFormSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export const profileFormSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema,
});

// Утилиты для валидации
export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

export const getValidationError = (
  error: z.ZodError
): Record<string, string> => {
  return error.errors.reduce(
    (acc, curr) => {
      const path = curr.path.join('.');
      acc[path] = curr.message;
      return acc;
    },
    {} as Record<string, string>
  );
};

// Типы для форм
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
