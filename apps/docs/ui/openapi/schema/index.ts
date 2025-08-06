import * as z from "zod";

export const isMongoObjectId = (id?: string) => !!id && /^[0-9a-fA-F]{24}$/.test(id);

export const phoneRegEx = /^(?:0|\+62)(?:\d{3}-\d{4}-\d{4}|\d{3}-\d{3}-\d{4}|\d{4}-\d{4}-\d{3}|\d{4}-\d{4}-\d{4})$/;

export const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-]{8,}$/;

export const passwordMessage = "Passwords Invalid";
export const phoneMessage = "Contoh input yang valid: 0812-3456-7890 atau +62812-3456-7890";

export const containsLetters = (str: string | undefined) => /[a-zA-Z]{2,}/.test(str || "");

export const passwordSchema = (message: string) => z.string().refine(password => passwordRegEx.test(password), { message });
export const phoneSchema = (message: string) => z.string().refine(input => phoneRegEx.test(input), { message });

export const UserGender = ["Male", "Female"] as const;
export type UserGender = (typeof UserGender)[number];

export const AboutSchema = z.object({
  birthDay: z.optional(z.date()),
  birthPlace: z.optional(z.string()),
  bio: z.optional(z.string()),
  resume: z.optional(z.string()),
  nationalId: z.optional(z.string()),
  taxId: z.optional(z.string()),
  gender: z.optional(z.enum(UserGender, { message: "Invalid value" })),
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

export const LinkSchema = z.object({
  name: z.optional(z.string()),
  url: z.string().url()
});

export const SettingGeneralSchema = z.object({
  name: z.optional(z.string()),
  firstName: z.optional(z.string()),
  lastName: z.optional(z.string()),
  image: z.optional(z.string().url("Invalid image URL")).nullable(),
  phone: z.optional(phoneSchema(phoneMessage)),
  about: AboutSchema.optional(),
  links: z.optional(z.array(LinkSchema))
});

export const SignUpSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name is required"
    }),
    email: z.string().email({
      message: "Email is required"
    }),
    password: passwordSchema(passwordMessage),
    confirmPassword: passwordSchema("Password does not match")
  })
  .refine(data => data.password === data.confirmPassword, {
    message: passwordMessage,
    path: ["confirmPassword"]
  })
  .refine(data => containsLetters(data.name), {
    message: "Name must contain at least two letters",
    path: ["name"]
  });

export const SignInSchema = z.object({
  identifier: z.string({
    message: "Username/Email is required"
  }),
  password: passwordSchema(passwordMessage)
  // code: z.optional(z.string())
});

export const ChatType = ["PRIVATE", "GROUP", "CHANNEL", "BOT"] as const;
export type ChatType = (typeof ChatType)[number];

export const CreateChatSchema = z
  .object({
    userId: z.string().optional(),
    name: z.string().optional(),
    type: z.enum(ChatType),
    members: z
      .array(
        z
          .object({
            value: z.string().optional()
          })
          .refine(data => isMongoObjectId(data.value), {
            message: "Not valid id",
            path: ["value"]
          })
      )
      .optional()
      .default([])
  })
  .refine(
    data => {
      const hasValidUserId = isMongoObjectId(data.userId);
      const hasValidMembers = data.members?.some(m => isMongoObjectId(m.value));
      return hasValidUserId || hasValidMembers;
    },
    {
      message: "Either userId or at least one valid member is required",
      path: []
    }
  );

export const MessageType = ["TEXT", "IMAGE", "VIDEO", "AUDIO", "FILE", "STICKER", "SYSTEM"] as const;
export type MessageType = (typeof MessageType)[number];

export const MessageStatus = ["SENDING", "SENT", "FAILED", "SEEN"] as const;
export type MessageStatus = (typeof MessageStatus)[number];

export const CreateMessageSchema = z.object({
  chatId: z.string(),
  body: z.string().nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  type: z.enum(MessageType).default("TEXT")
});

type ender = {
  id: string;
  username: string;
  email: string;
  image: string | null;
  lastSeen: Date | null;
};

export const MinimalUser = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  image: z.string().nullable().optional(),
  lastSeen: z.date().nullable().optional()
});

export const GetMessageSchema = z.object({
  sender: MinimalUser,
  seen: z.array(MinimalUser).default([]),
  chatId: z.string(),
  id: z.string(),
  createdAt: z.date(),
  status: z.enum(MessageStatus),
  body: z.string().nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  type: z.enum(MessageType).default("TEXT")
});
