import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import  { UserModel }  from "@/model/User";
import { promises } from "dns";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text ",
          placeholder: "example@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: " ****** ",
        },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("No user found width this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify you account before login");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user  }) {
        if (user){
            token._id = user._id?.toString();
            token.isAcceptingMessage= user.isAcceptingMessage;
            token.username = user.username
        }
        return token;
      },
    async session({ session, token }) {
      if (token) {
          session.user._id = token._id 
          session.user.isVerified = token.isVerified 
          session.user.isAcceptingMessage 
          token.isAcceptingMessage
          session.user.username = token.username
      }
      return session 
    },
    
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};