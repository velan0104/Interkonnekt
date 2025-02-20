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
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { WordRotate } from "@/components/ui/word-rotate";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

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


type SignupFormValues = z.infer<typeof signupSchema>;

const customStyles = {
  control: (base:any) => ({
    ...base,
    backgroundColor: "#f3f4f6", 
    border: "1px solid #d1d5db", 
    borderRadius: "0.375rem", 
    padding: "0.25rem", 
    boxShadow: "none",
    "&:hover": {
      borderColor: "#9ca3af", 
    },
  }),
  menu: (base:any) => ({
    ...base,
    backgroundColor: "#f9fafb", 
    borderRadius: "0.375rem", 
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
  }),
  option: (base:any, state:any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#e5e7eb" : "#f9fafb", 
    color: state.isFocused ? "#000000" : "#374151", 
    padding: "0.5rem 0.75rem", 
    borderRadius: "0.25rem", 
  }),
  multiValue: (base:any) => ({
    ...base,
    backgroundColor: "#dbeafe", 
    borderRadius: "0.375rem", 
    padding: "0 0.5rem", 
    display: "flex",
    alignItems: "center",
  }),
  multiValueLabel: (base:any) => ({
    ...base,
    color: "#1e40af", 
  }),
  multiValueRemove: (base:any) => ({
    ...base,
    color: "#1e40af", 
    "&:hover": {
      backgroundColor: "#1e40af", 
      color: "#ffffff", 
    },
  }),
};

export default function SignupForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();
 
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
        localStorage.setItem('auth_token', '');
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
    } catch (err) {
      console.error("Error during Google SignIn", err);
      
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-5xl flex flex-col lg:flex-row rounded-lg shadow-2xl overflow-hidden">
        {/* Left Section */}
        <div className=" hidden w-full lg:w-1/2 h-auto  bg-gradient-to-tr from-blue-600 to-blue-800 text-white lg:flex flex-col items-center justify-center p-6 sm:p-10">
        
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-[-26px]"><TypewriterEffectSmooth words={words1} /></h2>
          <span className="text-sm sm:text-xl text-center inline-flex items-center gap-0  whitespace-nowrap     ">
  Join a  
  <AnimatedGradientText>
    <WordRotate
      className="text-base font-bold text-black dark:text-white  animate-gradient bg-gradient-to-r from-[#42E695] via-[#3BB2B8] to-[#42E695] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"
      words={["thriving", "growing", "active"]}
    />  
  </AnimatedGradientText>

  community of  
  <AnimatedGradientText>
    <WordRotate
      className="text-base font-bold text-black dark:text-white  animate-gradient bg-gradient-to-r from-[#42E695] via-[#3BB2B8] to-[#42E695] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"
      words={["like-minded", "passionate", "enthusiastic"]}
    />  
  </AnimatedGradientText>
  individuals!
</span>


           
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
          className="relative w-full lg:w-1/2 bg-gray-800 p-6 sm:p-10 flex flex-col justify-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center mb-6">
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
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Your full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500"/>
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
                        className="w-full bg-gray-800/80 text-white border border-gray-700 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 shadow-inner backdrop-blur-md"
                        placeholder="Your username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500"/>
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
                        className="w-full bg-gray-800/80 text-white border border-gray-700 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 shadow-inner backdrop-blur-md"
                        type="email"
                        placeholder="example@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500"/>
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
                        className="w-full bg-gray-800/80 text-white border border-gray-700 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 shadow-inner backdrop-blur-md"
                        type="password"
                        placeholder="Enter a strong password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500"/>
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
                   
                    <FormMessage className="text-red-500"/>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 font-semibold"
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

              {/* <Button
                onClick={handleGoogleSignIn}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600 py-3 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
              >
                {isSigningIn
                  ? "Signing in with Google..."
                  : "Sign in with Google"}
              </Button> */}
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
    </div>
  );
}

