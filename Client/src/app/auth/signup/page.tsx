"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import CreatableSelect from "react-select/creatable";

const signupSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not exceed 30 characters." }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not exceed 30 characters." }),
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .min(1, { message: "Email is required." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(50, { message: "Password must not exceed 50 characters." }),
  interest: z
    .array(z.string())
    .min(1, { message: "Enter at least one interest." }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const customStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: "#1f2937",
    border: "1px solid #53c97d",
    borderRadius: "0.375rem",
    padding: "0.25rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#53c97d",
    },
    color: "#ffffff",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#374151",
    borderRadius: "0.375rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#53c97d" : "#1f2937",
    color: state.isFocused ? "#ffffff" : "#d1d5db",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.25rem",
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#53c97d",
    borderRadius: "0.375rem",
    padding: "0 0.5rem",
    display: "flex",
    alignItems: "center",
    color: "#ffffff",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#ffffff",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#1f2937",
      color: "#53c97d",
    },
  }),
};

export default function SignupForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();
const pathname = usePathname()
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    gsap.fromTo(
      ".left-section",
      { x: "-100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (!session) {
      localStorage.setItem("auth_token", "");
    }
  }, []);

  const words1 = [
    {
      text: "Interkonnekt",
      className: "text-white dark:text-blue-500",
    },
  ];

  const words2 = [
    {
      text: "Join",
    },
    {
      text: "a",
    },
    {
      text: "thriving",
    },
    {
      text: "community",
    },
    {
      text: "of",
    },
    {
      text: "like-minded",
    },
    {
      text: "individuals!",
    },
  ];

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      interest: [],
    },
  });

  const [isSigningIn, setIsSigningIn] = useState(false);

  const interestOptions = [
    { value: "technology", label: "Technology" },
    { value: "science", label: "Science" },
    { value: "art", label: "Art" },
    { value: "sports", label: "Sports" },
    { value: "music", label: "Music" },
  ];

 

  const userId = session?.user?.id;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn("google", { callbackUrl: `/main` });
      toast({
        title: "🚀 Google Sign-Up Successful!",
        description: "Welcome! Redirecting you now...",
        className: "bg-gray-900 text-[#53c97d] border border-[#53c97d] shadow-lg",
      });
    } catch (err) {
      console.error("Error during Google SignIn", err);
      toast({
        title: "⚠️ Google Sign-Up Failed",
        description: "Oops! Something went wrong. Please try again.",
        className: "bg-gray-900 text-red-400 border border-red-500 shadow-lg",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, interest: interests }),
      });

      if (response.ok) {
        toast({
          title: "🚀 Sign-Up Successful!",
          description: "Welcome! Redirecting you now...",
          className: "bg-gray-900 text-[#53c97d] border border-[#53c97d] shadow-lg",
        });
        router.push("/auth/signin");
      } else {
        const error = await response.json();
        toast({
          title: "⚠️ Sign-Up Failed",
          description: "Oops! Something went wrong. Please try again.",
          className: "bg-gray-900 text-red-400 border border-red-500 shadow-lg",
        });
      }
    } catch (err) {
      toast({
        title: "⚠️ Sign-Up Failed",
        description: "Oops! Something went wrong. Please try again.",
        className: "bg-gray-900 text-red-400 border border-red-500 shadow-lg",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddInterest = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value.trim() !== "") {
      setInterests((prev) => [...prev, event.currentTarget.value.trim()]);
      form.setValue("interest", [
        ...interests,
        event.currentTarget.value.trim(),
      ]);
      event.currentTarget.value = ""; // Clear the input field
    }
  };

  const handleRemoveInterest = (interest: string) => {
    const updatedInterests = interests.filter((item) => item !== interest);
    setInterests(updatedInterests);
    form.setValue("interest", updatedInterests);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-gray-800 p-10 rounded-2xl shadow-xl text-white"
      >
        <h2 className="text-3xl font-bold text-center text-[#53c97d] mb-6">
          Sign Up
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#53c97d] focus:border-green-500 transition-all"
                        placeholder="Your full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </motion.div>
            {/* Username Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Username</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#53c97d] focus:border-green-500 transition-all placeholder-gray-400 shadow-inner backdrop-blur-md"
                        placeholder="Your username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-400">Email</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full bg-gray-700 text-white border border-gray-700 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#53c97d] focus:border-green-500 transition-all placeholder-gray-400 shadow-inner backdrop-blur-md"
                          type="email"
                          placeholder="example@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </motion.div>
              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-400">Password</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full bg-gray-700 text-white border border-gray-700 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-[#53c97d] transition-all placeholder-gray-400 shadow-inner backdrop-blur-md"
                          type="password"
                          placeholder="Enter a strong password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </motion.div>
            </div>
            {/* Interest Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Interest</FormLabel>
                    <FormControl>
                      <Controller
                        name="interest"
                        control={form.control}
                        render={({ field }) => (
                          <CreatableSelect
                            isMulti
                            options={interestOptions}
                            value={field.value.map(
                              (interest) =>
                                interestOptions.find(
                                  (option) => option.value === interest
                                ) || {
                                  value: interest,
                                  label: interest,
                                }
                            )}
                            onChange={(selectedOptions) => {
                              const updatedInterests = selectedOptions.map(
                                (option) => option.value
                              );
                              field.onChange(updatedInterests);
                              setInterests(updatedInterests);
                            }}
                            placeholder="Select or create your interests"
                            styles={customStyles}
                            classNamePrefix="react-select"
                            onKeyDown={(e) => {
                              // Prevent form submission when pressing enter
                              if (e.key === "Enter") {
                                e.preventDefault();
                              }
                            }}
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full  text-white py-3 rounded-lg shadow-lg transition-all"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#53c97d] hover:bg-[#42a767]  text-white py-3 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 font-semibold"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>
            </motion.button>

            <p className="text-center text-gray-500">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-[#53c97d] underline">
                Log in
              </Link>
            </p>
          </form>
        </Form>
        <Button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-3 rounded-2xl shadow-md  mt-5 font-medium"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiHa4Twc-U2klLkqvuVq7PUQznfqx6LnV5Ag&s"
            alt="Google"
            className="w-10 h-9 "
          />
          {isSigningIn ? "Signing in with Google..." : "Sign up with Google"}
        </Button>
      </motion.div>
      
    </div>
  );
}
