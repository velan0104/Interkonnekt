"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { gsap } from "gsap";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Select from "react-select";
import { twMerge } from "tailwind-merge";
import { Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

// Define the Zod schema for validation
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
    interest: z.array(z.string()).min(1, { message: "Enter at least one interest." }),
});

// Define the type for the form inputs
type SignupFormValues = z.infer<typeof signupSchema>;

const customStyles = {
  control: (base:any) => ({
    ...base,
    backgroundColor: "#f3f4f6", // Tailwind `bg-gray-100`
    border: "1px solid #d1d5db", // Tailwind `border-gray-300`
    borderRadius: "0.375rem", // Tailwind `rounded-md`
    padding: "0.25rem", // Tailwind `p-1`
    boxShadow: "none",
    "&:hover": {
      borderColor: "#9ca3af", // Tailwind `hover:border-gray-400`
    },
  }),
  menu: (base:any) => ({
    ...base,
    backgroundColor: "#f9fafb", // Tailwind `bg-gray-50`
    borderRadius: "0.375rem", // Tailwind `rounded-md`
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Tailwind `shadow-md`
  }),
  option: (base:any, state:any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#e5e7eb" : "#f9fafb", // Tailwind `bg-gray-200`
    color: state.isFocused ? "#000000" : "#374151", // Tailwind `text-gray-700`
    padding: "0.5rem 0.75rem", // Tailwind `p-2`
    borderRadius: "0.25rem", // Tailwind `rounded`
  }),
  multiValue: (base:any) => ({
    ...base,
    backgroundColor: "#dbeafe", // Tailwind `bg-blue-100`
    borderRadius: "0.375rem", // Tailwind `rounded-md`
    padding: "0 0.5rem", // Tailwind `px-2`
    display: "flex",
    alignItems: "center",
  }),
  multiValueLabel: (base:any) => ({
    ...base,
    color: "#1e40af", // Tailwind `text-blue-900`
  }),
  multiValueRemove: (base:any) => ({
    ...base,
    color: "#1e40af", // Tailwind `text-blue-900`
    "&:hover": {
      backgroundColor: "#1e40af", // Tailwind `hover:bg-blue-900`
      color: "#ffffff", // Tailwind `hover:text-white`
    },
  }),
};

export default function SignupForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();
 // console.log("session: ",session)
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    // GSAP Animation for Left Section
    gsap.fromTo(
      ".left-section",
      { x: "-100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  // Initialize the form with react-hook-form and Zod resolver
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
      // Redirect to Google login
      await signIn("google", { callbackUrl: `/profile` });
    } catch (err) {
      console.error("Error during Google SignIn", err);
      
    } finally {
      setIsSigningIn(false);
    }
  };

  console.log("updated interests: ", interests);
  // Handle form submission
  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, interest: interests }),
      });

      if (response.ok) {
        toast({ title: "Signup successful!", description: "Welcome!" });
        router.push("/auth/signin");
      } else {
        const error = await response.json();
        toast({ title: "Signup failed", description: error.message });
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddInterest = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value.trim() !== "") {
      setInterests((prev) => [...prev, event.currentTarget.value.trim()]);
      form.setValue("interest", [...interests, event.currentTarget.value.trim()]);
      event.currentTarget.value = ""; // Clear the input field
    }
  };
  
  const handleRemoveInterest = (interest: string) => {
    const updatedInterests = interests.filter((item) => item !== interest);
    setInterests(updatedInterests);
    form.setValue("interest", updatedInterests);
  };

 


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="relative w-full max-w-5xl flex flex-col lg:flex-row rounded-lg shadow-2xl overflow-hidden">
        {/* Left Section */}
        <div className="left-section w-full lg:w-1/2 h-64 lg:h-auto bg-gradient-to-tr from-blue-600 to-blue-800 text-white flex flex-col items-center justify-center">
          <h2 className="text-4xl font-extrabold">InterKonnekt</h2>
          <p className="text-sm text-center mt-4">
            Join a thriving community of like-minded individuals!
          </p>
          {/* <img
            src="https://source.unsplash.com/featured/?community"
            alt="Community"
            className="w-full h-full absolute inset-0 object-cover opacity-30"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-transparent opacity-60"></div>
        </div>

        {/* Right Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="relative w-full lg:w-1/2 bg-gray-800 p-8 lg:p-16 bottom-10"
        >
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">
            Sign Up
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 border-gray-600 text-gray-300 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Your full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Username</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 border-gray-600 text-gray-300 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Your username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 border-gray-600 text-gray-300 focus:ring-blue-600 focus:border-blue-600"
                        type="email"
                        placeholder="example@example.com"
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
                        placeholder="Enter a strong password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Interest Field */}
              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">Interest</FormLabel>
                    <FormControl>
                      {/* <Input
                        className="bg-gray-700 border-gray-600 text-gray-300 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Your interest"
                       // {...field}
                       onKeyDown={handleAddInterest}
                      /> */}
                        <Controller
          name="interest"
          control={form.control}
          render={({ field }) => (
            <CreatableSelect
              isMulti
              options={interestOptions}
              value={field.value.map((interest) =>
                interestOptions.find((option) => option.value === interest) || {
                  value: interest,
                  label: interest,
                }
              )}
              onChange={(selectedOptions) =>{
                const updatedInterests = selectedOptions.map((option) => option.value);
                field.onChange(updatedInterests);
                setInterests(updatedInterests);  
              }
              }
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
                   
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>

              <p className="text-center text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-blue-400 underline"
                >
                  Log in
                </Link>
              </p>

              <Button
                onClick={handleGoogleSignIn}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600 py-3 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
              >
                {isSigningIn
                  ? "Signing in with Google..."
                  : "Sign in with Google"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}

