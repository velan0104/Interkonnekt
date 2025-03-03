import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { useSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";


interface Credentials {
  //name: string;
  emailOrUsername: string;
  password: string;
  // interest: string;
  // image?: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        // name: { label: "Name", type: "text", placeholder: "Your full name" },
        emailOrUsername: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter email or username",
        },
        password: { label: "Password", type: "password" },
        // interest?: { label: "Interest", type: "text", placeholder: "Your interest" },
        //image: { label: "Image URL", type: "text", placeholder: "Profile image URL (optional)" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Missing credentials.");
        }

        let user = null;

        const { emailOrUsername, password } = credentials as Credentials;
        await dbConnect();
        //Check if the user already exists
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
        console.log("Existing User: ", existingUser);

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

      //console.log("token at custom: ",token)

      // console.log("user at custom: ",user);
      // console.log("account at custom: ",account)

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

      console.log("Hello from jwt USER: ", user);
      console.log("Hello from jwt TOKEN: ", token);

      if (user) {
        const cookie = serialize("auth_token", JSON.stringify(token), {
          httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 24 * 60 * 60, // 24 hours.
        });

        globalThis.myResponse?.setHeader("set-cookie", cookie);
        console.log(globalThis.myResponse);
        console.log("Cookies: ", cookie);
      }

      //console.log("JWT token:", token);
      return token;
    },

    async signIn({ user, account, profile }) {
      // console.log("User profile:", profile); // View Google profile data
      // console.log("user: ",user);
      // console.log("account: ",account)
      try {
        await dbConnect();
        // const collection = db.collection("users");
        const existingUser = await User.findOne({ email: user.email });
         console.log("existing user: ",existingUser)
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
          console.log("data inserted successfully: ",existingUser);
        } else {
          console.log("user already exists");
          if (account?.provider === "google") {
            existingUser.image = existingUser.image;
            existingUser.provider = account.provider;
            existingUser.interest = existingUser.interest;
            // existingUser.id = account.providerAccountId;
            // existingUser.id = existingUser.id;
            existingUser.username = existingUser.username;
            await existingUser.save();
            console.log("Updated existing user with Google data.");
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
      // console.log("existing user in session: ",existingUser)
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
        console.log("Session Token:", session);
      await dbConnect();

     // console.log("Id in session updated: ", token.id);
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
});

export { handler as GET, handler as POST };
// export default function authHandler(req: any, res: any) {
//   // Directly pass `res` to the handler, no need for global variables
//   return handler(req, res);
// }


