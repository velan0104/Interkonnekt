"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleSelector from "./MultipleSelector";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  bio: z.string().min(1, "Bio is required"),
  profilePic: z
    .instanceof(File, { message: "Image is required" })
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "File is required"
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be under 4MB"
    ),
  banner: z
    .instanceof(File, { message: "Image is required" })
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "File is required"
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 6,
      "File must be under 6MB"
    ),
  category: z.string().min(1, "Category is Required"),
  members: z.array(z.string()).length(2, "At least two member is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data: ", data);
  };

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const profilePicRef = useRef<HTMLInputElement | null>(null);
  const bannerImgRef = useRef<HTMLInputElement | null>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
    console.log(profilePreview);
  };

  // const contacts = ["Ram", "Shyam", "Karan", "Aman"];
  const options = [
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" }, // Disabled option
    { value: "svelte", label: "Svelte" },
    { value: "gsap", label: "GSAP " },
  ];

  const [selectedOptions, setSelectedOptions] = React.useState<
    { value: string; label: string }[]
  >([]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" rounded-xl bg-gray-600/10 text-black h-[500px] relative min-w-[400px]"
    >
      <div>
        <div
          className="h-28 bg-zinc-200/10 flex items-center justify-center text-white rounded-t-xl cursor-pointer"
          onClick={() => bannerImgRef.current?.click()}
        >
          <ImagePlus className=" text-2xl " />
        </div>
        <Controller
          name="banner"
          control={control}
          render={({ field }) => (
            <input
              type="file"
              className="hidden"
              ref={bannerImgRef}
              onChange={(e) => field.onChange(e.target.files?.[0])} // Convert to File object
            />
          )}
        />
        {errors.banner && <p>{errors.banner.message}</p>}
      </div>

      <div className="mb-8">
        <div
          onClick={() => profilePicRef.current?.click()}
          className="size-[4.5rem] rounded-full bg-white absolute top-16 left-4 flex items-center justify-center cursor-pointer"
        >
          {profilePreview ? (
            <img
              src={profilePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Plus />
          )}
        </div>
        <Controller
          name="profilePic"
          control={control}
          render={({ field }) => (
            <input
              type="file"
              className="hidden"
              ref={profilePicRef}
              onChange={handleProfilePicChange} // Convert to File object
            />
          )}
        />
        {errors.profilePic && <p>{errors.profilePic.message}</p>}
      </div>

      <div className="px-5 space-y-3">
        <div>
          <label className="font-light text-base text-white"> Name </label>
          <br />
          <input
            type="text"
            {...register("name")}
            className="h-10 w-[90%] bg-transparent border-b-2 border-b-gray-700 outline-none text-white"
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label className="font-light text-base text-white"> Bio </label>
          <br />
          <input
            {...register("bio")}
            className="h-10 w-[90%] bg-transparent border-b-2 border-b-gray-700 outline-none text-white"
          />
          {errors.bio && <p>{errors.bio.message}</p>}
        </div>

        <div className="flex gap-5 items-center mt-2">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-[180px] bg-gray-900 rounded-xl text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white rounded-xl">
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {/* <input type="text" {...register("category")} /> */}
          {errors.profilePic && <p> {errors.category?.message} </p>}
        </div>

        <div>
          <label className="font-light text-base text-white pb-2">
            {" "}
            Members{" "}
          </label>
          <br />
          <Controller
            name="members"
            control={control}
            render={({ field }) => (
              <MultipleSelector
                className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                options={options}
                placeholder="Select Technologies..."
                value={field.value || []} // Default to empty array
                onChange={field.onChange} // Update form state
                hidePlaceholderWhenSelected
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600">
                    No results found
                  </p>
                }
              />
            )}
          />

          {/* <input type="text" {...register("members")} /> */}
          {errors.members && <p> {errors.members?.message} </p>}
        </div>
      </div>
    </form>
  );
}
