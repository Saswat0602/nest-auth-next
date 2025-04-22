import NextAuth, { Session } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token?: string
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
      id?: string | null
    }
  }
}