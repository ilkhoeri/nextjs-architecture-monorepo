import { z } from 'zod';
import { OpenAPIObject, InfoObject } from 'openapi3-ts/oas31';
import { createDocument, extendZodWithOpenApi } from 'zod-openapi';
import { SettingGeneralSchema, SignUpSchema, CreateChatSchema, SignInSchema, CreateMessageSchema, GetMessageSchema } from './schema';

extendZodWithOpenApi(z);

const info: InfoObject = {
  title: 'API Docs',
  version: '1.0.0',
  description: 'API documentation for my Next.js application'
};

const SessionSchema = z
  .object({
    user: z
      .object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        image: z.string().url().optional()
      })
      .optional(),
    expires: z.string().datetime()
  })
  .openapi({
    title: 'Session',
    description: 'NextAuth session object'
  });

const CsrfTokenSchema = z
  .object({
    csrfToken: z.string()
  })
  .openapi({
    title: 'CSRF Token',
    description: 'CSRF token for NextAuth'
  });

const signUpExample = {
  name: 'johndoe',
  email: 'johndoe@mail.com',
  password: 'Johndoe123!',
  confirmPassword: 'Johndoe123!'
};

export const openApiDocument: OpenAPIObject = createDocument({
  info,
  openapi: '3.0.0',
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL!,
      description: 'Main API Server'
    }
    // Jika ada server lain, misal untuk lingkungan development
    // {
    //   url: 'http://localhost:3000/',
    //   description: 'Development Server'
    // }
  ],
  paths: {
    // --- NextAuth ---
    '/api/auth/csrf': {
      get: {
        tags: ['Users Management'],
        summary: 'Get CSRF token',
        description: 'Retrieves the CSRF token required for POST requests.',
        responses: {
          '200': {
            description: 'Successful response with CSRF token',
            content: {
              'application/json': {
                schema: CsrfTokenSchema
              }
            }
          }
        },
        security: [{ bearerAuth: [] }]
      }
    },
    '/api/getProfile': {
      get: {
        tags: ['Users Management'],
        summary: 'Get current user session',
        description: 'Retrieves the current user session details.',
        responses: {
          '200': {
            description: 'Successful response with session data',
            content: {
              'application/json': {
                schema: SessionSchema
              }
            }
          },
          '401': {
            description: 'Unauthorized'
          }
        }
      }
    },
    '/api/auth/users': {
      get: {
        tags: ['Users Management'],
        summary: 'Get all users',
        responses: {
          '200': {
            description: 'A list of users',
            content: {
              'application/json': {
                schema: z.array(SignUpSchema).openapi({
                  description: 'Array of user objects'
                })
              }
            }
          }
        }
        // security: [{ bearerAuth: [] }]
      }
    },
    // "/api/auth/signup": {
    '/api/register': {
      post: {
        tags: ['Users Management'],
        summary: 'Create a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: SignUpSchema.openapi({
                title: 'SignUp Request',
                description: 'User data to create'
              }),
              example: signUpExample
            },
            'application/x-www-form-urlencoded': {
              schema: SignUpSchema.openapi({
                title: 'SignUp Request Form',
                description: 'User data to create via form'
              }),
              example: signUpExample
            }
          }
        },
        responses: {
          '200': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: SignUpSchema,
                example: signUpExample
              }
            }
          },
          '400': {
            description: 'Email and Name already exists'
          },
          '401': {
            description: 'Email already exists'
          },
          '402': {
            description: 'Name already used'
          }
        }
      }
    },
    '/api/login': {
      post: {
        tags: ['Users Management'],
        summary: 'Sign in',
        description: 'Initiates the sign-in process.',
        requestBody: {
          description: 'Optional: Callback URL after successful sign-in',
          content: {
            'application/x-www-form-urlencoded': {
              schema: SignInSchema.openapi({
                title: 'SignIn Request'
              })
            }
          }
        },
        responses: {
          '200': {
            description: 'Sign in successfully',
            content: {
              'application/x-www-form-urlencoded': {
                schema: z.array(SignInSchema).openapi({
                  title: 'SignIn Request'
                })
              }
            }
          },
          '400': {
            description: 'Bad Request'
          }
        }
      }
    },
    /**
    "/api/auth/signin/{providerId}": {
      // Representasi dynamic route untuk sign-in
      post: {
        tags: ["Users Management"],
        summary: "Sign in with a provider",
        description: "Initiates the sign-in process for a specified provider.",
        parameters: [
          {
            name: "providerId",
            in: "path",
            required: true,
            description: 'ID of the authentication provider (e.g., "google", "github")',
            schema: {
              type: "string"
            }
          }
        ],
        requestBody: {
          description: "Optional: Callback URL after successful sign-in",
          content: {
            "application/x-www-form-urlencoded": {
              schema: z
                .object({
                  callbackUrl: z.string().url().optional(),
                  csrfToken: z.string().optional() // CSRF token diperlukan untuk POST
                })
                .openapi({
                  title: "SignIn Request"
                })
            }
          }
        },
        responses: {
          "200": {
            description: "Redirect to provider or success page"
          },
          "400": {
            description: "Bad Request"
          }
        }
      }
    },
    "/api/auth/signout": {
      post: {
        tags: ["Users Management"],
        summary: "Sign out",
        description: "Signs out the current user.",
        requestBody: {
          description: "Optional: Callback URL after successful sign-out",
          content: {
            "application/x-www-form-urlencoded": {
              schema: z
                .object({
                  callbackUrl: z.string().url().optional(),
                  csrfToken: z.string().optional() // CSRF token diperlukan untuk POST
                })
                .openapi({
                  title: "SignOut Request"
                })
            }
          }
        },
        responses: {
          "200": {
            description: "Redirect to sign-out page or success"
          }
        }
      }
    },
     */
    '/api/updateProfile': {
      put: {
        tags: ['Users Management'],
        summary: 'Update user by ID',
        description: "Updates an existing user's information by their ID.",
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            description: 'The ID of the user to update',
            schema: {
              type: 'string',
              format: 'objectid'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: SettingGeneralSchema
            },
            'application/x-www-form-urlencoded': {
              schema: SettingGeneralSchema
            }
          }
        },
        responses: {
          '200': {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: SignUpSchema
              }
            }
          },
          '400': {
            description: 'Invalid input or user not found'
          },
          '401': {
            description: 'Unauthorized'
          }
        }
        // security: [{ bearerAuth: [] }]
      }
    },
    // --- Penambahan Endpoint DELETE untuk Delete User ---
    '/api/auth/danger/delete/user/{userId}': {
      delete: {
        tags: ['Users Management'],
        summary: 'Delete user by ID (DANGER ZONE)',
        description: 'Deletes a user permanently by their ID. This action is irreversible.',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            description: 'The ID of the user to delete',
            schema: {
              type: 'string',
              format: 'objectid'
            }
          }
        ],
        responses: {
          '204': {
            description: 'User deleted successfully (No Content)'
          },
          '400': {
            description: 'Invalid user ID'
          },
          '401': {
            description: 'Unauthorized'
          },
          '404': {
            description: 'User not found'
          }
        }
        // security: [{ bearerAuth: [] }]
      }
    },
    // --- Akhir Penambahan untuk NextAuth ---
    '/api/chats': {
      get: {
        tags: ['Chats Management'],
        summary: 'Get all chats',
        responses: {
          '200': {
            description: 'A list of chats',
            content: {
              'application/json': {
                schema: z.array(CreateChatSchema).openapi({
                  description: 'Array of chat objects'
                })
              }
            }
          }
        }
        // security: [{ bearerAuth: [] }]
      },
      post: {
        tags: ['Chats Management'],
        summary: 'Create a new chat',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: CreateChatSchema.openapi({
                description: 'chat data to create'
              })
            },
            'application/x-www-form-urlencoded': {
              schema: CreateChatSchema.openapi({
                title: 'Create chat Form',
                description: 'Chat data to create (Form Data)'
              })
            }
          }
        },
        responses: {
          '201': {
            description: 'chat created successfully',
            content: {
              'application/json': {
                schema: CreateChatSchema
              }
            }
          }
        }
      }
    },
    '/api/viewMessages': {
      get: {
        tags: ['Messages Management'],
        summary: 'Get all messages or filter by chat ID',
        description: 'Retrieves a list of all messages. Optionally, filter messages by a specific chat ID.',
        parameters: [
          {
            name: 'chatId',
            in: 'query',
            required: false,
            description: 'Optional: Filter messages by chat ID',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'A list of messages',
            content: {
              'application/json': {
                schema: z.array(GetMessageSchema).openapi({
                  description: 'Array of message objects'
                })
              }
            }
          },
          '401': {
            description: 'Unauthorized'
          },
          '500': {
            description: 'Internal Server Error'
          }
        }
        // security: [{ bearerAuth: [] }]
      }
    },
    '/api/sendMessage': {
      post: {
        tags: ['Messages Management'],
        summary: 'Create a new message',
        description: 'Sends a new message to a specified chat.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: CreateMessageSchema.openapi({
                title: 'Create Message JSON',
                description: 'Message data to create (JSON)'
              })
            },
            'application/x-www-form-urlencoded': {
              schema: CreateMessageSchema.openapi({
                title: 'Create Message Form',
                description: 'Message data to create (Form Data)'
              })
            }
          }
        },
        responses: {
          '201': {
            description: 'Message created successfully',
            content: {
              'application/json': {
                schema: GetMessageSchema
              }
            }
          },
          '400': {
            description: 'Invalid input'
          },
          '401': {
            description: 'Unauthorized'
          },
          '500': {
            description: 'Internal Server Error'
          }
        },
        security: [{ bearerAuth: [] }]
      }
    }
  },
  components: {
    /**
    schemas: {
      User: SignUpSchema.openapi({ ref: "User" }),
      Chat: CreateChatSchema.openapi({ ref: "Chat" }),
      Session: SessionSchema,
      CsrfToken: CsrfTokenSchema,
      UpdateUser: SettingGeneralSchema
    },
    */
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT Bearer token in the format **Bearer &lt;token>**'
      }
    }
  },
  tags: [
    {
      name: 'Users Management',
      description: 'Operations related to user management and authentication'
    },
    {
      name: 'Chats Management',
      description: 'Operations related to chat functionalities'
    },
    {
      name: 'Messages Management',
      description: 'Operations related to message functionalities'
    }
  ],
  security: [{ bearerAuth: [] }] // Semua endpoint memerlukan autentikasi secara default
});
