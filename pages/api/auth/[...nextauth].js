import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "credentials",
      async authorize(credentials) {
        try {
          const { user } = credentials;
          if (!user) {
            throw new Error("Invalid user credentials");
          }
          return JSON.parse(user);
        } catch (error) {
          console.error("Error authorizing user:", error);
          return null; 
        }
      },
    }),
    
  ],

  callbacks: {
    redirect: async (url, baseUrl) => {
      return baseUrl;
    },
    async session(session, token) {
      session.user = token.user;
      return { ...session };
    },
    async jwt(token, user) {
      if (user) token.user = user;
      return token;
    },
  },
  secret: process.env.JWT_SIGNING_PRIVATE_KEY,
  jwt: {
    secret: process.env.JWT_SIGNING_PRIVATE_KEY,
    encryption: false,
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
  },
});
