const { z } = require('zod');

// Messages Form Validation
const messageSchema = z.object({
  name: z
    .string()
    .min(4, 'Name must be at least 4 characters long')
    .trim()
    .nonempty('Name field is required'),
  phone: z
    .string()
    .regex(/^01[0-2,5][0-9]{8}$/, 'Phone must be a valid Egyptian number')
    .nonempty('Phone field is required'),
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email field is required'),
  message: z
    .string()
    .min(15, 'Message must be at least 15 characters long')
    .trim()
    .nonempty('Message field is required'),
});

// Client sign up schema
const ClientSignupSchema = z
  .object({
    f_name: z.string().min(3, 'First name must be at least 3 characters long'),
    l_name: z.string().min(3, 'Last name must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .regex(/^01[0-2,5][0-9]{8}$/, 'Invalid Egyptian phone number'),
    password: z
      .string()
      .min(8)
      .regex(/[@#$%^&*]/, 'Password must include @, #, $, %, ^, or &'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

// Client Login Schema
const ClientLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8),
});

// Client user Schema
const ClientUserSchema = z.object({
  f_name: z.string().min(3, 'First name must be at least 3 characters long'),
  l_name: z.string().min(3, 'Last name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^01[0-2,5][0-9]{8}$/, 'Invalid Egyptian phone number'),
  main_address: z.string().optional(),
  gender: z.string().optional(),
  date_of_birth: z.string().optional(),
  nationality: z.string().optional(),
  bio: z.string().optional(),
});

// Address validation schema
const ClientAddressSchema = z.object({
  address_name: z
    .string()
    .min(2, 'Address name must be at least 2 characters long'),
  address_details: z
    .string()
    .min(10, 'Address details must be at least 10 characters long'),
});

module.exports = {
  messageSchema,
  ClientSignupSchema,
  ClientLoginSchema,
  ClientUserSchema,
  ClientAddressSchema,
};
