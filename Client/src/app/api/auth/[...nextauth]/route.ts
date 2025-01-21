import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { serialize } from "cookie";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { useSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";


interface Credentials {
  //name: string;
  emailOrUsername:string,
  password: string;
 // interest: string;
 // image?: string;
}


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
       // name: { label: "Name", type: "text", placeholder: "Your full name" },
        emailOrUsername: { label: "Email or Username", type: "text", placeholder: "Enter email or username" },
        password: { label: "Password", type: "password" },
       // interest?: { label: "Interest", type: "text", placeholder: "Your interest" },
        //image: { label: "Image URL", type: "text", placeholder: "Profile image URL (optional)" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Missing credentials.");
        }

        let user = null

        const {emailOrUsername, password } = credentials as Credentials;
        await dbConnect();
        //Check if the user already exists
        const existingUser = await User.findOne({
          $or: [
            { email: emailOrUsername },
            { username: emailOrUsername },
          ],
        });

        if (!existingUser) {
          throw new Error("User does not exist with the provided email or username.");
        }
    
        // Compare hashed passwords
        const isPasswordValid = password === existingUser.password; // Replace with a hashing function like bcrypt.compare
    
        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }
    
        // If credentials are valid, return the user object
        return {
          id: existingUser.username,
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
        clientSecret: process.env.GITHUB_SECRET as string
    })
  ],
 
  session: {
    strategy: "jwt",
    maxAge: 3600,  
    updateAge: 1800,  
  },
  callbacks: {
      async jwt({ token, user ,account}) {
        
    
        if (user && account) {
         
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.username = user.username;
          token.interest = user.interest;
          token.image = user.image;
          token.provider = account.provider;
          token.accessToken = account.access_token; 

          
           
          
        }
        return token;
      },

    async signIn({ user, account, profile }) {
      
      try{
       await dbConnect();
    
      const existingUser = await User.findOne({ email: user.email });
   

      if (!existingUser) {
        
        const newUser = new User({
          id: user.id,
          name: user.name,
          
          email: user.email,
          image: user.image,
          createdAt: new Date()
        })
        await newUser.save();
        console.log("data inserted successfully")
      }else{
        console.log("user already exists");
        if (account?.provider === "google") {
          existingUser.image = existingUser.image ;
          existingUser.provider = account.provider;
          existingUser.interest =  existingUser.interest;
         
           existingUser.username =  existingUser.username;
          await existingUser.save();
          console.log("Updated existing user with Google data.");
        }
      }

      return true;
    }catch(error){
      console.log("error in google signin: ",error)
      return false;
    }
    },
    async session({ session, token }) {
      
      session.user = {
        id: token?.id ,
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
    //  console.log("Session Token:", session);
      await dbConnect();
     
      
     const existingUser = await User.findOne({
        email: token.email,
      });
     // console.log("existing user in session: ",existingUser)
       existingUser.id = token.id;
      await existingUser.save();
console.log("Id in session updated: ", token.id)
      return session;
    },
    
   
  },
});

 export { handler as GET, handler as POST };




