import NextAuth, { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

interface Credentials {
  emailOrUsername: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        emailOrUsername: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter email or username",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Missing credentials.");
        }

        let user = null;

        const { emailOrUsername, password } = credentials as Credentials;
        await dbConnect();
        const existingUser = await User.findOne({
          $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });

        if (!existingUser) {
          throw new Error(
            "User does not exist with the provided email or username."
          );
        }

        // Compare hashed passwords
        const isPasswordValid = password === existingUser.password; // Replace with a hashing function like bcrypt.compare

        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }

        // If credentials are valid, return the user object
        return {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          username: existingUser.username,
          interest: existingUser.interest,
          image: existingUser.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // JWT token expires after 1 hour
    // updateAge: 1800,  // The session is refreshed every 30 minutes
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // if (account) {
      //   // Save details to the token if it's a new login
      //   token.accessToken = account.access_token; // Use the account's access token
      //   token.provider = account.provider;
      // }

      if (user && account) {
        // Save user ID and email to token
        token.id = user?.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.interest = user.interest;
        token.image = user.image;
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }

      if (user) {
        const cookie = serialize("auth_token", JSON.stringify(token), {
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 24 * 60 * 60, // 24 hours.
        });

        globalThis.myResponse?.setHeader("set-cookie", cookie);
      }

      return token;
    },

    async signIn({ user, account, profile }) {
      try {
        await dbConnect();
        // const collection = db.collection("users");
        const existingUser = await User.findOne({ email: user.email });
        //   const newUser = new User({
        //     name,
        //   username,
        //   email,
        //   password: hashedPassword,
        //   interest,
        // });

        // await newUser.save();

        if (!existingUser) {
          // await User.insertOne({
          //   name: profile?.name,
          //   email: user.email,
          //   image: profile,
          //   createdAt: new Date(),
          // });
          const newUser = new User({
            id: user.id,
            name: user.name,

            email: user.email,
            image: user.image,
            createdAt: new Date(),
          });
          await newUser.save();
        } else {
          if (account?.provider === "google") {
            existingUser.image = existingUser.image;
            existingUser.provider = account.provider;
            existingUser.interest = existingUser.interest;
            // existingUser.id = account.providerAccountId;
            // existingUser.id = existingUser.id;
            existingUser.username = existingUser.username;
            await existingUser.save();
          }
        }

        return true;
      } catch (error) {
        console.log("error in google signin: ", error);
        return false;
      }
    },
    async session({ session, token }) {
      const existingUser = await User.findOne({
        email: token.email,
      });
      existingUser.id = existingUser._id;
      await existingUser.save();

      session.user = {
        id: existingUser?._id,
        email: token?.email ?? undefined,
        name: token?.name ?? undefined,
        username: token?.username ?? undefined,
        interest: token.interest ?? undefined,
        image: token?.image ?? null,
        provider: token?.provider ?? undefined,
      } as {
        id: string;
        email?: string;
        name?: string;
        username?: string;
        interest?: string;
        image?: string;
        provider?: string;
      };
      await dbConnect();

      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      const jwtToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "24h" }
      );

      const cookie = serialize("auth_token", jwtToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 24 * 60 * 60,
      });
      globalThis.myResponse?.setHeader("Set-cookie", cookie);
    },
  },
};
