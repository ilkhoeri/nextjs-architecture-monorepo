import * as z from 'zod';

export const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-]{8,}$/;

export const phoneRegEx = /^(?:0|\+62)(?:\d{3}-\d{4}-\d{4}|\d{3}-\d{3}-\d{4}|\d{4}-\d{4}-\d{3}|\d{4}-\d{4}-\d{4})$/;

export type SignUpFormValues = z.infer<typeof SignUpSchema>;

export type SettingsFormValues = z.infer<typeof SettingsSchema>;

export type SettingGeneralFormValues = z.infer<typeof SettingGeneralSchema>;

export type AboutSchemaFormValues = z.infer<typeof AboutSchema>;

export type SettingPasswordFormValues = z.infer<typeof SettingPasswordSchema>;

export type SettingPasswordBySuperAdminFormValues = z.infer<typeof SettingPasswordSchemaBySuperAdmin>;

export type SettingRoleStatusFormValues = z.infer<typeof SettingRoleStatusSchema>;

export type AddressFormValues = { address: z.infer<typeof AddressSchema> | null };

export const passwordMessage = 'Passwords Invalid';
export const phoneMessage = 'Example of valid input: 0812-3456-7890 atau +62812-3456-7890';

export const accountStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED', 'BANNED']);
export const visibilityEnum = z.enum(['PUBLIC', 'PRIVATE', 'CONNECTIONS_ONLY']);
export const roleEnum = z.enum(['SUPERADMIN', 'ADMIN', 'USER']);

export const passwordSchema = (message: string) => z.string().refine(password => passwordRegEx.test(password), { message });
export const phoneSchema = (message: string) => z.string().refine(input => phoneRegEx.test(input), { message });
export const containsLetters = (str: string | undefined) => /[a-zA-Z]{2,}/.test(str || '');

export const statusByRole = {
  DEVELOPER: ['DEVELOPER'],
  SUPERADMIN: ['LEADER'],
  ADMIN: ['LEADER', 'TEACHER', 'STUDENT'],
  USER: ['TEACHER', 'STUDENT', 'ALUMNI', 'OUT']
};

export const enumStatusByRole = {
  DEVELOPER: z.enum(['DEVELOPER']),
  SUPERADMIN: z.enum(['LEADER']),
  ADMIN: z.enum(['LEADER', 'TEACHER', 'STUDENT']),
  USER: z.enum(['TEACHER', 'STUDENT', 'ALUMNI', 'OUT'])
};

export const SettingAvatarImageSchema = z.object({
  image: z.nullable(z.string())
});

export const SettingsSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.optional(z.string()),
    name: z.optional(z.string()),
    email: z.optional(z.string().email('Invalid email format')),
    image: z.optional(z.string().url('Invalid image URL')).nullable(),
    phone: z.optional(phoneSchema(phoneMessage)),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: roleEnum,
    status: accountStatusEnum,
    password: z.optional(passwordSchema('Make sure conditions are met')),
    newPassword: z.optional(passwordSchema('Make sure conditions are met')),
    confirmPassword: z.optional(passwordSchema('Passwords do not match'))
  })
  .refine(
    data => {
      if (data.password && !data.newPassword) return false;
      return true;
    },
    { message: 'New password is required!', path: ['newPassword'] }
  )
  .refine(
    data => {
      if (data.newPassword && !data.password) return false;
      return true;
    },
    { message: 'Password is required!', path: ['password'] }
  )
  .refine(data => data.newPassword === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export function validateRoleStatus(role: keyof typeof statusByRole): { valid: boolean; message?: string } {
  if (!statusByRole[role]) {
    return { valid: false, message: `Role "${role}" ` };
  }
  return { valid: true };
}

export const SettingRoleStatusSchema = z
  .object({
    role: roleEnum,
    status: accountStatusEnum
  })
  .refine(
    ({ role }) => {
      if (!statusByRole[role]) return false;
      return true;
    },
    {
      message: 'Status does not match the selected role',
      path: ['status']
    }
  );

export const SettingPasswordSchema = z
  .object({
    email: z.optional(z.string().email('Invalid email format')),
    password: passwordSchema('Make sure conditions are met'),
    newPassword: passwordSchema('Make sure conditions are met'),
    confirmPassword: passwordSchema('Passwords do not match')
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: passwordMessage,
    path: ['confirmPassword']
  });

export const SettingPasswordSchemaBySuperAdmin = z.object({
  email: z.optional(z.string().email('Invalid email format')),
  newPassword: z.optional(passwordSchema('Make sure conditions are met')),
  confirmPassword: z.optional(passwordSchema('Passwords do not match'))
});

export const NewPasswordSchema = z.object({
  password: passwordSchema(passwordMessage)
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required'
  })
});

export const SignInSchema = z.object({
  identifier: z.string().min(2, {
    message: 'Username/Email is required'
  }),
  password: passwordSchema(passwordMessage),
  code: z.optional(z.string())
});

export const CredentialsSchema = z.object({
  email: z.string().email(),
  password: passwordSchema(passwordMessage)
});

export const SignUpSchema = z
  .object({
    name: z.string().min(2, {
      message: 'Name is required'
    }),
    email: z.string().email({
      message: 'Email is required'
    }),
    password: passwordSchema(passwordMessage),
    confirmPassword: passwordSchema('Password does not match')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: passwordMessage,
    path: ['confirmPassword']
  })
  .refine(data => containsLetters(data.name), {
    message: 'Name must contain at least two letters',
    path: ['name']
  });

export const UserLinkSchema = z.object({
  name: z.optional(z.string()),
  url: z.string().url().min(11)
});

export const UserGender = ['Male', 'Female'] as const;
export type UserGender = (typeof UserGender)[number];

export const AboutSchema = z.object({
  birthDay: z.optional(z.date()),
  birthPlace: z.optional(z.string()),
  bio: z.optional(z.string()),
  resume: z.optional(z.string()),
  nationalId: z.optional(z.string()),
  taxId: z.optional(z.string()),
  gender: z.optional(z.enum(UserGender, { message: 'Invalid value' })),
  horoscope: z.optional(z.string()),
  zodiac: z.string().optional(),
  height: z.optional(z.coerce.number()),
  weight: z.optional(z.coerce.number()),
  goals: z.array(z.string()).optional().default([]),
  hobby: z.array(z.string()).optional().default([]),
  interests: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  notes: z.array(z.string()).optional().default([])
});

export const AddressSchema = z.object({
  /** Negara */
  country: z.string().optional(),
  /** Provinsi/Negara Bagian */
  state: z.string().optional(),
  /** Kode pos */
  postalcode: z.string().optional(),
  /** Jalan */
  street: z.string().optional(),
  /** Kota */
  city: z.string().optional(),
  /** Kabupaten */
  regency: z.string().optional(),
  /** Kecamatan */
  district: z.string().optional(),
  /** Kelurahan */
  subdistrict: z.string().optional(),
  /** Desa */
  village: z.string().optional(),
  /** Catatan (Jika ada) */
  notes: z.array(z.string()).optional().default([]),
  /** Visibility */
  visibility: visibilityEnum.optional()
});

export const SettingGeneralSchema = z.object({ name: z.optional(z.string()), about: AboutSchema.optional() });
