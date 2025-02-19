"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

const formSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, { message: "This field is required" })
    .refine(
      (value) =>
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(value) || // Valid email format
        /^[a-zA-Z0-9_.-]+$/.test(value), // Valid username format
      { message: "Enter a valid email or username" }
    ),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { emailOrUsername: ""  , password: "" },
  });

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      
      await signIn("google", { callbackUrl: `/main` });
    } catch (err) {
      console.error("Error during Google SignIn", err);
      
    } finally {
      setIsSigningIn(false);
    }
  };

  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
   
    try {
      const response = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/main",
        
       
        emailOrUsername: data.emailOrUsername,
        password: data.password,
        
      });

      if (response?.ok) {
        toast({ title: "Signup successful!", description: "Welcome!" });
        router.push("/main"); // Redirect to main page or dashboard
      } else {
        toast({ title: "Signup failed", description: response?.error || "Error occurred." });
      }
    } catch (err) {
      console.error("Signup Error", err);
      toast({ title: "Error", description: "Something went wrong during signup." });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Welcome Back!
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Sign in to access your account and connect with your community.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Email or Username Field */}
            <FormField
              control={form.control}
              name="emailOrUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-700 border-gray-600 text-gray-300 focus:ring-blue-600 focus:border-blue-600"
                      type="text"
                      placeholder="Enter your email or username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-700 border-gray-600 text-gray-300 focus:ring-blue-600 focus:border-blue-600"
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="text-blue-400 underline"
            >
              Sign Up
            </a>
          </p>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600 py-3 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
          >
            {isSigningIn
              ? "Signing in with Google..."
              : "Sign in with Google"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
