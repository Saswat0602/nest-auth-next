import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if the user exists in the database (or perform any other necessary validation)
      // If the user is allowed to sign in, return true
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Explicitly redirect to the dashboard after successful authentication
      return `${baseUrl}/dashboard`;
    },
    async session({ session, token, user }) {
      // Add access_token to the session
      session.access_token = token.access_token as string;
      
      // Pass the user ID from the token to the session if available
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      
      return session;
    },
    async jwt({ token, account }) {
      // If we have an access token, add it to the token
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    }
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  }
})

export { handler as GET, handler as POST }
