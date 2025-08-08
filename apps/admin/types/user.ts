import { UserGender } from '@/schemas/user';
import * as db from '@prisma/client';

export type User = db.User & ExtendedUser;

// export const IsRole = Object.values(db.$Enums.UserRole);
export const IsRole = ['SUPERADMIN', 'ADMIN', 'USER'];
export type IsRole = db.User['role'];

export const IsAccountStatus = Object.values(db.$Enums.AccountStatus);
export type IsAccountStatus = db.User['status'];

export const OAuthProvider = ['credentials', 'oauth', 'github', 'google', 'apple'] as const;
export type OAuthProvider = (typeof OAuthProvider)[number];

type UserAbout = Omit<db.About, 'gender'> & { gender?: UserGender };

export type ExtendedUser = {
  /**  */
  accounts?: db.Account[] | null;
  /**  */
  about?: UserAbout | null;
  /**  */
  address?: db.Address | null;
  /**  */
  links?: db.Link[] | null;
  // isOAuth: boolean;
};

export interface ElaboratedSession {
  session: (db.User & { isOAuth: boolean }) | null;
}

export namespace USER {
  export type ADDRESS = db.Address & {};
  export type LINK = db.Link & {};
  export type LINKS = db.Link[] | null;
}

export namespace FORM_USER {
  export interface FORM_ADDRESS {
    data: AddressProps | null | undefined;
  }
  export interface FORM_LINK {
    data: db.Link | null;
  }
}

export type AddressProps = {
  country?: string | null;
  state?: string | null;
  postalcode?: string | null;
  street?: string | null;
  city?: string | null;
  regency?: string | null;
  district?: string | null;
  subdistrict?: string | null;
  village?: string | null;
  // optional fo user schema
  id?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  notes?: string[];
  userId?: string | null;
};

type SecureFromOtherUser = keyof typeof pickFromOtherUser;

export type MinimalAccount = Pick<NonNullable<User>, SecureFromOtherUser>;

export const pickFromOtherUser = {
  id: true,
  // refId: true,
  email: true,
  image: true,
  // name: true,
  username: true,
  // firstName: true,
  // lastName: true,
  // lastOnline: true,
  lastSeen: true
  // chatIds: true,
  // createdAt: true
}; // as db.Prisma.UserSelect;
